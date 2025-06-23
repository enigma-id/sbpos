import React from 'react';
import { BackHandler, View } from 'react-native';
import Share from 'react-native-share';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
  Button,
  Divider,
  Icon,
  ListItem,
  Modal,
  Text,
} from '@ui-kitten/components';

import useOrder from '../../../services/sales/order/hook';

import {
  Container,
  Content,
  Loading,
  Receipt,
} from '../../../components/screen';
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  Styles,
} from '../../../components/theme/styles';
import colors from '../../../components/theme/colors';
import { currencyFormat } from '../../../components/utils/common';
import { usePrint } from '../../../components/utils/usePrint';

const ConfirmationScreen = ({ route }) => {
  const router = useNavigation();

  const order = route?.params?.order;
  const pulseIconRef = React.useRef();

  const { show, showResult } = useOrder();
  const { printReceipt, devices, showDeviceModal, setShowDeviceModal } =
    usePrint();

  const [receipt, setReceipt] = React.useState('');

  const onShare = () => {
    const opt = {
      title: 'Struk POS',
      url: receipt,
      failOnCancel: false,
      saveToFiles: true,
    };

    Share.open(opt);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Alihkan ke halaman katalog kalau user bisa back
        router.reset({
          index: 1,
          routes: [{ name: 'home' }, { name: 'catalog' }],
        });
        return true; // cegah back default
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      // Disable gesture swipe back (iOS)
      router.setOptions?.({
        gestureEnabled: false,
      });

      return () => backHandler.remove();
    }, [router]),
  );

  React.useEffect(() => {
    show({ id: order?.id });
  }, []);

  React.useEffect(() => {
    pulseIconRef.current?.startAnimation();
  }, []);

  const data = showResult?.data?.data;

  const onPrint = async () => {
    await printReceipt(data);
  };

  const onDeviceSelected = async device => {
    setShowDeviceModal(false);
    await printReceipt(data, device);
  };

  let total_return = data?.total_payment - data?.total_charges;

  if (showResult.isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content>
        <View
          style={[
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
            { height: DEVICE_HEIGHT / 2.5 },
          ]}
        >
          <Icon
            status="success"
            animation="pulse"
            animationConfig={{ cycles: Infinity }}
            ref={pulseIconRef}
            name="checkmark-circle-outline"
            style={{ width: 100, height: 100, color: colors.SUCCESS }}
          />

          <Text
            category="h3"
            style={[
              Styles.textCenter,
              Styles.textUppercase,
              Styles.mt5,
              { letterSpacing: 1 },
            ]}
          >
            Transaksi Berhasil
          </Text>
        </View>

        <View>
          <ListItem
            disabled
            title={() => <Text category="p1">Pembayaran</Text>}
            style={[Styles.px6]}
            accessoryRight={() => (
              <Text
                category="h4"
                style={[Styles.textUppercase, Styles.textEnd]}
              >
                {data?.payment_method?.name || 'cash'}
              </Text>
            )}
          />
          <Divider />
          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p1">Total Tagihan</Text>}
            accessoryRight={() => (
              <Text
                category="h4"
                style={[Styles.textUppercase, Styles.textEnd]}
              >
                {currencyFormat(data?.total_charges)}
              </Text>
            )}
          />
          <Divider />
          <ListItem
            style={[Styles.px6]}
            disabled
            title={() => <Text category="p1">Tunai Diterima</Text>}
            accessoryRight={() => (
              <Text
                category="h4"
                style={[Styles.textUppercase, Styles.textEnd]}
              >
                {currencyFormat(data?.total_payment)}
              </Text>
            )}
          />
          <Divider />

          {total_return > 0 && (
            <ListItem
              disabled
              style={[Styles.px6]}
              title={() => <Text category="p1">Kembalian</Text>}
              accessoryRight={() => (
                <Text
                  category="h4"
                  style={[Styles.textUppercase, Styles.textEnd]}
                >
                  {currencyFormat(total_return)}
                </Text>
              )}
            />
          )}

          <View style={[Styles.px6, Styles.py4]}>
            <View
              style={[
                Styles.flex,
                Styles.justifyContentBetween,
                Styles.mt4,
                { gap: 8, flexWrap: 'wrap' },
              ]}
            >
              <View style={{ flex: 1, marginRight: 4 }}>
                <Button onPress={onPrint} size="small" appearance="outline">
                  CETAK STRUK
                </Button>
              </View>
              <View onPress={onShare} style={{ flex: 1, marginLeft: 4 }}>
                <Button onPress={onShare} size="small" appearance="outline">
                  KIRIM STRUK
                </Button>
              </View>
            </View>

            <Button
              style={[Styles.mt4]}
              onPress={() =>
                router.reset({
                  index: 1,
                  routes: [{ name: 'home' }, { name: 'catalog' }],
                })
              }
              size="small"
            >
              BUAT TRANSAKSI BARU
            </Button>
          </View>
        </View>
      </Content>

      <Receipt data={data} onLoaded={data => setReceipt(data)} />

      <Modal
        visible={showDeviceModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShowDeviceModal(false)}
      >
        <View
          style={[
            Styles.bgWhite,
            Styles.rounded3,
            Styles.px5,
            Styles.py5,
            { width: DEVICE_WIDTH / 1.5 },
          ]}
        >
          {devices?.map((b, i) => (
            <Button
              appearance="outline"
              key={i}
              onPress={() => onDeviceSelected(b)}
              style={{ marginBottom: 8 }}
            >
              {b?.deviceName || b?.name || 'Device ' + (i + 1)}
            </Button>
          ))}
          <Button
            status="danger"
            style={[Styles.mt5]}
            onPress={() => setShowDeviceModal(false)}
          >
            BATAL
          </Button>
        </View>
      </Modal>
    </Container>
  );
};

export default ConfirmationScreen;
