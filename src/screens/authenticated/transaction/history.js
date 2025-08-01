import { View } from 'react-native';
import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Button, Divider, ListItem, Modal, Text } from '@ui-kitten/components';

import { Container, Content, Loading } from '../../../components/screen';
import { currencyFormat, dateFormat } from '../../../components/utils/common';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import useSession from '../../../services/sales/session/hook';
import { usePrint } from '../../../components/utils/usePrint';

const HistoryScreen = ({ route }) => {
  const router = useNavigation();
  const { show, showResult } = useSession();
  const { printSummary, devices, showDeviceModal, setShowDeviceModal } =
    usePrint();

  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState([]);

  const fetchOrders = async () => {
    await show({ id: route?.params?.id });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const onPrint = async () => {
    const datas = {
      summary: data,
      cash: data?.cash_finished,
    };
    await printSummary(datas);
  };

  const onDeviceSelected = async device => {
    setShowDeviceModal(false);
    const datas = {
      summary: data,
      cash: data?.cash_finished,
    };

    await printSummary(datas, device);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  React.useEffect(() => {
    if (showResult.isSuccess) {
      setData(showResult?.data?.data);
      setRefreshing(false);
    }
  }, [showResult]);

  if (showResult.isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content refreshing={refreshing} onRefresh={handleRefresh}>
        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Cashier</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {data?.cashier?.name || '-'}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Session time</Text>}
          accessoryRight={() => (
            <View>
              <Text style={[Styles.textEnd]} category="h5">
                {dateFormat(data?.started_at, 'DD/MM/YYYY HH:mm')}
              </Text>
              <Text style={[Styles.textEnd]} category="h5">
                {dateFormat(data?.finished_at, 'DD/MM/YYYY HH:mm', '(ongoing)')}
              </Text>
            </View>
          )}
        />
        <Divider />

        <Text
          category="s2"
          style={[
            Styles.px6,
            Styles.py4,
            Styles.textUppercase,
            Styles.textGrey,
            { letterSpacing: 1, fontWeight: 'bold' },
          ]}
        >
          CASHFLOW
        </Text>

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Starting Cash</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.cash_started)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Ending Cash</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.cash_finished)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Expected Cash</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.cash_due)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total Bill Payments</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.bill_payment)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Topup Cash</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.cash_topup)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total Sales</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.summary_order?.total_nett)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total Discount</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.summary_order?.total_discount)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total After Discount</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.summary_order?.total_charges)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total Bills</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(data?.summary_order?.total_openbill)}
            </Text>
          )}
        />
        <Divider />

        <ListItem
          disabled
          style={[Styles.px6]}
          title={() => <Text category="p2">Total Omzet</Text>}
          accessoryRight={() => (
            <Text style={[Styles.textEnd]} category="h5">
              {currencyFormat(
                data?.summary_order?.total_openbill +
                  data?.summary_order?.total_nett,
              )}
            </Text>
          )}
        />
        <Divider />

        <Text
          category="s2"
          style={[
            Styles.px6,
            Styles.py4,
            Styles.textUppercase,
            Styles.textGrey,
            { letterSpacing: 1, fontWeight: 'bold' },
          ]}
        >
          PAYMENTS
        </Text>

        {data?.cash_payments?.map((item, i) => (
          <View key={i}>
            <ListItem
              disabled
              style={[Styles.px6]}
              title={() => (
                <Text category="p2">{item?.payment_name || 'Cash'}</Text>
              )}
              accessoryRight={() => (
                <Text style={[Styles.textEnd]} category="h5">
                  {currencyFormat(item?.subtotal)}
                </Text>
              )}
            />
            <Divider />
          </View>
        ))}

        <Text
          category="s2"
          style={[
            Styles.px6,
            Styles.py4,
            Styles.textUppercase,
            Styles.textGrey,
            { letterSpacing: 1, fontWeight: 'bold' },
          ]}
        >
          Category Sold
        </Text>

        {data?.category_solds?.map((item, i) => (
          <View key={i}>
            <ListItem
              disabled
              style={[Styles.px6]}
              accessoryLeft={() => (
                <View
                  style={[
                    Styles.bgNotification,
                    Styles.me3,
                    Styles.rounded3,
                    Styles.alignItemsCenter,
                    Styles.justifyContentCenter,
                    { minWidth: 25, height: 25 },
                  ]}
                >
                  <Text category="h5">{item?.quantity}</Text>
                </View>
              )}
              title={() => <Text category="p2">{item?.name || 'Cash'}</Text>}
              accessoryRight={() => (
                <Text style={[Styles.textEnd]} category="h5">
                  {currencyFormat(item?.total_charges)}
                </Text>
              )}
            />
            <Divider />
          </View>

          // <div
          //   key={i}
          //   className="flex place-content-between place-items-center py-2"
          // >
          //   <div>
          //     <span className="bg-base-content rounded-lg px-3 py-1 text-sm text-white">
          //       {item?.quantity}
          //     </span>
          //     <span className="ps-2 text-sm">{item?.name || '-'}</span>
          //   </div>
          //   <span className="text-sm">
          //     {currencyFormat(item?.total_charges)}
          //   </span>
          // </div>
        ))}
      </Content>
      <View
        style={[
          Styles.px6,
          Styles.py4,
          Styles.bgWhite,
          { borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <View style={[Styles.flex, { gap: 10 }]}>
          <View style={{ flex: 1, marginRight: 4 }}>
            <Button onPress={onPrint} size="small">
              Print Summary
            </Button>
          </View>
          <View style={{ flex: 1, marginLeft: 4 }}>
            <Button
              size="small"
              onPress={() =>
                router.navigate('transaction/list', { id: data?.id })
              }
            >
              Sales Order
            </Button>
          </View>
        </View>
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

export default HistoryScreen;
