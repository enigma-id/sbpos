import React from 'react';
import { View } from 'react-native';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

import {
  Button,
  Divider,
  Input,
  ListItem,
  Modal,
  Text,
} from '@ui-kitten/components';

import useOrder from '../../../services/sales/order/hook';

import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import {
  Container,
  Content,
  Loading,
  Receipt,
} from '../../../components/screen';
import { currencyFormat, dateFormat } from '../../../components/utils/common';
import { usePrint } from '../../../components/utils/usePrint';
import { renderCaption, renderTitle } from '../../../components/utils/form';
import { CommonActions, useNavigation } from '@react-navigation/native';

const DetailScreen = ({ route }) => {
  const router = useNavigation();
  const state = router.getState();

  const Session = useSelector(state => state?.Auth?.session);
  const FormState = useSelector(state => state?.Form);

  const { id } = route?.params;
  const { show, showResult, cancel, cancelResult } = useOrder();
  const { printReceipt, devices, showDeviceModal, setShowDeviceModal } =
    usePrint();

  const [receipt, setReceipt] = React.useState('');
  const [cancelModal, setCancelModal] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [discountMap, setDiscountMap] = React.useState([]);

  const onShare = () => {
    const opt = {
      title: 'Struk POS',
      url: receipt,
      failOnCancel: false,
      saveToFiles: true,
    };

    Share.open(opt);
  };

  const onCancel = async () => {
    const payload = {
      pin: pin,
    };
    cancel({ id, payload });
  };

  React.useEffect(() => {
    show({ id });
  }, [id]);

  React.useEffect(() => {
    if (cancelResult?.isSuccess) {
      setCancelModal(false);
      setPin('');
      const routes = state?.routes?.slice(0, -1);
      router.dispatch(
        CommonActions.reset({
          index: routes.length - 1,
          routes,
        }),
      );
    }
  }, [cancelResult]);

  const groupedCategories = items => {
    const group = {};

    items.forEach(item => {
      const category = item?.catalog?.category;
      const discount = item?.discount_value * item?.quantity || 0;

      if (!category) return;

      const id = category.id;
      const name = category.name;

      if (!group[id]) {
        group[id] = {
          id,
          name,
          subtotal: 0,
        };
      }

      group[id].subtotal += discount;
    });

    const result = Object.values(group).filter(item => item.subtotal > 0);
    setDiscountMap(result);
  };

  React.useEffect(() => {
    if (!showResult?.data?.data) return;
    groupedCategories(showResult?.data?.data?.items);
  }, [showResult]);

  if (showResult.isLoading) {
    return <Loading />;
  }

  const data = showResult?.data?.data;

  const onPrint = async () => {
    await printReceipt(data);
  };

  const onDeviceSelected = async device => {
    setShowDeviceModal(false);
    await printReceipt(data, device);
  };

  return (
    <Container>
      <Content>
        <View>
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
            INFORMASI TRANSAKSI
          </Text>

          {(data?.ticket || data?.note) && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => <Text category="p2">Bills name</Text>}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    {data?.ticket || data?.note}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}

          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p2">Customer</Text>}
            accessoryRight={() => (
              <Text style={[Styles.textEnd]} category="h5">
                {data?.membership?.name || '-'}
              </Text>
            )}
          />
          <Divider />

          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p2">Cashier</Text>}
            accessoryRight={() => (
              <Text style={[Styles.textEnd]} category="h5">
                {data?.session?.cashier?.name || '-'}
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
                  {dateFormat(data?.session?.started_at, 'DD/MM/YYYY HH:mm')}
                </Text>
                <Text style={[Styles.textEnd]} category="h5">
                  {dateFormat(
                    data?.session?.finished_at,
                    'DD/MM/YYYY HH:mm',
                    '(ongoing)',
                  )}
                </Text>
              </View>
            )}
          />
          <Divider />

          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p2">Tanggal Transaksi</Text>}
            accessoryRight={() => (
              <Text style={[Styles.textEnd]} category="h5">
                {dateFormat(data?.ordered_at, 'DD/MM/YYYY HH:mm')}
              </Text>
            )}
          />
          <Divider />

          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p2">Transaksi</Text>}
            accessoryRight={() => (
              <Text style={[Styles.textEnd]} category="h5">
                No. {data?.code}
              </Text>
            )}
          />
          <Divider />
        </View>

        <View>
          <Text
            category="s2"
            style={[
              Styles.textUppercase,
              Styles.textGrey,
              Styles.px6,
              Styles.py4,
              { letterSpacing: 1, fontWeight: 'bold' },
            ]}
          >
            INFORMASI BARANG
          </Text>

          {data?.items?.map((item, index) => (
            <View key={index}>
              <View style={[Styles.py3, Styles.bgWhite]}>
                <ListItem
                  disabled
                  style={[Styles.px6, Styles.py1]}
                  title={() => (
                    <Text category="h5">
                      {item?.catalog?.name || item?.description}
                    </Text>
                  )}
                  description={() => (
                    <Text category="c2">
                      {item?.quantity} x{' '}
                      {currencyFormat(item?.unit_nett, false)}
                    </Text>
                  )}
                  accessoryRight={() => (
                    <Text style={[Styles.textEnd]} category="h5">
                      {currencyFormat(item?.unit_nett * item?.quantity, false)}
                    </Text>
                  )}
                />
                {item?.additionals?.length > 0 &&
                  item?.additionals?.map((addition, addIndex) => (
                    <ListItem
                      key={addIndex}
                      disabled
                      style={{ paddingVertical: 2, paddingHorizontal: 20 }}
                      title={() => (
                        <Text category="s1">
                          + {addition?.catalog?.name}{' '}
                          {addition?.addon?.type === 'options'
                            ? ''
                            : `(${
                                addition?.quantity > 0 && addition?.quantity
                              } x ${currencyFormat(
                                addition?.unit_nett,
                                false,
                              )})`}
                        </Text>
                      )}
                      accessoryRight={() => (
                        <Text style={[Styles.textEnd]} category="h5">
                          {currencyFormat(
                            addition?.unit_nett * addition?.quantity,
                            false,
                          )}
                        </Text>
                      )}
                    />
                  ))}
              </View>
              <Divider />
            </View>
          ))}
        </View>

        <View>
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
            INFORMASI Pembayaran
          </Text>
          {data?.subtotal_nett > data?.total_charges && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => (
                  <Text category="p2">Subtotal Before Discount</Text>
                )}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    {data?.subtotal_gross > data?.subtotal_nett && (
                      <Text
                        category="s2"
                        style={{
                          textDecorationLine: 'line-through',
                        }}
                      >
                        {currencyFormat(data?.subtotal_gross, false)}{' '}
                      </Text>
                    )}
                    {currencyFormat(data?.subtotal_nett)}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}

          {data?.items.reduce((sum, item) => {
            const qty = item.quantity ?? 1; // default 1 kalau tidak ada quantity
            const discount = item.discount_value ?? 0;
            return sum + discount * qty;
          }, 0) > 0 &&
            discountMap?.map(d => (
              <>
                <ListItem
                  disabled
                  style={[Styles.px6]}
                  title={() => (
                    <Text category="p2">Discount Category {d?.name}</Text>
                  )}
                  accessoryRight={() => (
                    <Text style={[Styles.textEnd]} category="h5">
                      -{currencyFormat(d?.subtotal)}
                    </Text>
                  )}
                />
                <Divider />
              </>
            ))}

          {data?.discount_value > 0 && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => <Text category="p2">Discount Order</Text>}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    -{currencyFormat(data?.discount_value)}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}

          <ListItem
            disabled
            style={[Styles.px6]}
            title={() => <Text category="p2">Total</Text>}
            accessoryRight={() => (
              <Text style={[Styles.textEnd]} category="h5">
                {currencyFormat(data?.total_charges)}
              </Text>
            )}
          />
          <Divider />

          {data?.total_payment > 0 && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => (
                  <Text category="p2">
                    {data?.payment_method?.name || 'Cash'}
                  </Text>
                )}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    {currencyFormat(data?.total_payment)}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}

          {data?.total_payment - data?.total_charges > 0 && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => <Text category="p2">Change</Text>}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    {currencyFormat(data?.total_payment - data?.total_charges)}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}

          {data?.payment_ref !== '' && (
            <>
              <ListItem
                disabled
                style={[Styles.px6]}
                title={() => <Text category="p2">Ref</Text>}
                accessoryRight={() => (
                  <Text style={[Styles.textEnd]} category="h5">
                    {data?.payment_ref}
                  </Text>
                )}
              />
              <Divider />
            </>
          )}
        </View>
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
              CETAK STRUK
            </Button>
          </View>
          <View style={{ flex: 1, marginLeft: 4 }}>
            <Button onPress={onShare} size="small">
              KIRIM STRUK
            </Button>
          </View>
        </View>
        {Session?.user?.is_supervisor === 1 && (
          <View style={{ marginTop: 12 }}>
            <Button
              size="small"
              status="danger"
              onPress={() => setCancelModal(true)}
            >
              BATALKAN TRANSAKSI
            </Button>
          </View>
        )}
      </View>

      <Modal
        visible={cancelModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => {
          setCancelModal(false);
          setPin('');
        }}
      >
        <View
          style={[
            Styles.bgWhite,
            { borderRadius: 10, width: DEVICE_WIDTH / 1.1 },
          ]}
        >
          <View style={[Styles.px5, Styles.py5]}>
            <Text
              style={[Styles.textCenter, Styles.mb3]}
              category="h3"
              status="danger"
            >
              Batalkan Order
            </Text>
            <Divider />

            <Text style={[Styles.textCenter, Styles.mt3]} category="p2">
              Anda yakin akan membatalkan transaksi ini?
            </Text>
            <Text style={[Styles.textCenter, Styles.mb3]} category="p2">
              Jumlah uang cash ditangan akan di kalkulasi ulang.
            </Text>

            <Input
              style={[Styles.pb3, Styles.pt3]}
              textStyle={[Styles.fs3]}
              size="medium"
              value={pin}
              label={() =>
                renderTitle({
                  val: 'Masukan PIN',
                  required: true,
                })
              }
              caption={() => renderCaption(FormState?.errors?.pin)}
              status={FormState?.errors?.pin ? 'danger' : 'basic'}
              secureTextEntry
              onChangeText={v => setPin(v)}
              keyboardType="number-pad"
            />
          </View>
          <View style={[Styles.flex]}>
            <View style={{ flex: 1 }}>
              <Button
                size="small"
                style={{ borderRadius: 0, borderBottomLeftRadius: 10 }}
                onPress={onCancel}
              >
                KONFIRMASI
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                size="small"
                status="control"
                style={[Styles.textDanger]}
                onPress={() => {
                  setCancelModal(false);
                  setPin('');
                }}
              >
                BATAL
              </Button>
            </View>
          </View>
        </View>
      </Modal>

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

export default DetailScreen;
