import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  Button,
  Divider,
  Input,
  ListItem,
  Modal,
  Text,
} from '@ui-kitten/components';

import useSession from '../../../services/sales/session/hook';

import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { Container, Content } from '../../../components/screen';
import { renderTitle } from '../../../components/utils/form';
import { currencyFormat, dateFormat } from '../../../components/utils/common';
import useCart from '../../../services/cart/hook';
import useSalesChannel from '../../../services/sales/channel/hook';
import { usePrint } from '../../../components/utils/usePrint';

const CloseScreen = () => {
  const router = useNavigation();

  const { summary, summaryResult, end, endResult } = useSession();
  const { reset } = useCart();
  const { resetChannel } = useSalesChannel();
  const { printSummary, devices, showDeviceModal, setShowDeviceModal } =
    usePrint();

  const [cashStr, setCashStr] = React.useState('');
  const [cash, setCash] = React.useState(0);
  const [diff, setDiff] = React.useState(0);

  const onChange = input => {
    let cash_end_str = '';
    let cash_end = 0;

    if (typeof input === 'string') {
      cash_end_str = input;
      const clean = input.replace(/[^\d]/g, '');
      cash_end = Number(clean);

      if (isNaN(cash_end)) {
        cash_end = 0;
      }
    }

    setCashStr(cash_end_str);
    setCash(cash_end);

    const cash_due = Number(summaryResult?.data?.data?.cash_due || 0);
    const different = cash_end - cash_due;

    setDiff(isNaN(different) ? 0 : different);
  };

  const onEnd = async () => {
    const payload = {
      cash,
    };

    const data = {
      summary: summaryResult?.data?.data,
      cash,
    };

    await printSummary(data).then(success => {
      if (success) {
        end(payload);
      }
    });
  };

  const onDeviceSelected = async device => {
    setShowDeviceModal(false);
    const payload = {
      cash,
    };

    const data = {
      summary: summaryResult?.data?.data,
      cash,
    };

    await printSummary(data, device).then(success => {
      if (success) {
        end(payload);
      }
    });
  };

  React.useEffect(() => {
    summary();
  }, []);

  React.useEffect(() => {
    if (endResult.isSuccess) {
      reset();
      resetChannel();
      summary();

      router.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    }
  }, [endResult]);

  return (
    <Container>
      <Content onRefresh={null}>
        <ListItem
          style={[Styles.px6]}
          title={() => <Text style={[Styles.listTitle]}>Mulai Sesi</Text>}
          accessoryRight={() => (
            <Text style={[Styles.listTitle]} category="h6">
              {dateFormat(summaryResult?.data?.data?.started_at)}
            </Text>
          )}
        />
        <Divider />
        <ListItem
          style={[Styles.px6]}
          title={() => <Text style={[Styles.listTitle]}>Kasir</Text>}
          accessoryRight={() => (
            <Text style={[Styles.listTitle]} category="h6">
              {summaryResult?.data?.data?.cashier?.name}
            </Text>
          )}
        />
        <Divider />
        <ListItem
          style={[Styles.px6]}
          title={() => <Text style={[Styles.listTitle]}>Kas Awal</Text>}
          accessoryRight={() => (
            <Text style={[Styles.listTitle]} category="h6">
              {currencyFormat(summaryResult?.data?.data?.cash_started || 0)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          style={[Styles.px6]}
          title={() => <Text style={[Styles.listTitle]}>Total Transaksi</Text>}
          accessoryRight={() => (
            <Text style={[Styles.listTitle]} category="h6">
              {currencyFormat(summaryResult?.data?.data?.subtotal_order || 0)}
            </Text>
          )}
        />

        <View style={[Styles.px6, Styles.py4]}>
          <Input
            size="large"
            accessoryLeft={() => (
              <Text category="p2" style={[Styles.alignItemsCenter]}>
                Rp.
              </Text>
            )}
            value={cashStr}
            label={() =>
              renderTitle({
                val: 'Kas Akhir',
                required: true,
              })
            }
            // caption={() => renderCaption(FormState?.errors?.username)}
            // status={FormState?.errors?.username ? "danger" : "basic"}
            onChangeText={v => onChange(v)}
            keyboardType="number-pad"
          />
          <Text category="c1">Input jumlah kas tunai akhir</Text>
        </View>

        {cash > 0 && diff !== 0 && (
          <ListItem
            style={[Styles.px6, Styles.border]}
            title={() => <Text style={[Styles.listTitle]}>Selisih Kas</Text>}
            accessoryRight={() => (
              <Text status="danger" category="h5">
                {currencyFormat(diff)}
              </Text>
            )}
          />
        )}
      </Content>
      <View
        style={[
          Styles.px6,
          Styles.py4,
          Styles.bgWhite,
          { gap: 10, borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <Button
          size="small"
          status="danger"
          onPress={onEnd}
          disabled={endResult?.isLoading}
        >
          TUTUP SESI PENJUALAN
        </Button>
      </View>

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
              key={i}
              appearance="outline"
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

export default CloseScreen;
