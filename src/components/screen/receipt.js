import { Divider, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import { Image, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Styles } from '../theme/styles';
import { currencyFormat, dateFormat } from '../utils/common';

const Receipt = ({ data, onLoaded }) => {
  const [load, setLoad] = React.useState(true);
  const [discountMap, setDiscountMap] = React.useState([]);

  const onCapture = uri => {
    onLoaded(uri);
    setLoad(false);
  };

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
    if (!data) return;
    groupedCategories(data?.items);
  }, [data]);

  if (!load) {
    return null;
  }

  return (
    <ViewShot
      onCapture={onCapture}
      captureMode="mount"
      options={{ fileName: 'receipt', format: 'jpg', quality: 1 }}
    >
      <View style={{ backgroundColor: '#FFF' }}>
        <View
          style={{
            paddingVertical: 15,
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              width: 100,
              height: 60,
            }}
            source={require('../../assets/logo.png')}
            resizeMode="contain"
          />
        </View>

        <View style={[Styles.px5, Styles.py2, Styles.mb4]}>
          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">
                {dateFormat(data?.ordered_at, 'DD-MM-YYYY')}
              </Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {dateFormat(data?.ordered_at, 'HH:mm')}
              </Text>
            </View>
          </View>
          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">Transaction</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                No. {data?.code || '-'}
              </Text>
            </View>
          </View>
          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">Sales Channel</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {data?.channel?.name || '-'}
              </Text>
            </View>
          </View>

          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">Cashier</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {data?.session?.cashier?.name}
              </Text>
            </View>
          </View>

          {data?.note && (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text category="h5">Bill Name</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {data?.note}
                </Text>
              </View>
            </View>
          )}

          {data?.membership && (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text category="h5">Member</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {data?.membership?.name}
                </Text>
              </View>
            </View>
          )}

          {data?.ticket && (
            <View style={[Styles.flex, Styles.justifyContentBetween]}>
              <View>
                <Text category="h5">Bill Name</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {data?.ticket}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={[Styles.px5]}>
          <View style={[Styles.flex, Styles.justifyContentBetween]}>
            <View>
              <Text category="h5">Description</Text>
            </View>
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <Text category="h5" style={[Styles.textEnd]}>
                Total
              </Text>
            </View>
          </View>
          <Divider style={[Styles.bgSecondary, Styles.mb4]} />

          {data?.items?.map((item, i) => (
            <View key={i} style={[Styles.mb4]}>
              <View style={[Styles.flex, Styles.justifyContentBetween]}>
                <View>
                  <Text category="h5">
                    {item?.catalog?.name || item?.description}
                  </Text>
                  <Text category="h5">
                    {item?.quantity} x {currencyFormat(item?.unit_nett, false)}
                  </Text>
                </View>
                <View
                  style={[
                    Styles.flex,
                    Styles.justifyContentBetween,
                    Styles.pb2,
                  ]}
                >
                  <Text category="h5"></Text>
                  <Text category="h5" style={[Styles.textEnd]}>
                    {currencyFormat(item?.unit_nett * item?.quantity, false)}
                  </Text>
                </View>
              </View>
              {item?.additionals?.map((addon, idx) => (
                <View
                  style={[Styles.flex, Styles.justifyContentBetween]}
                  key={idx}
                >
                  <View>
                    <Text category="c2">
                      + {addon?.catalog?.name}{' '}
                      {addon?.addon?.type !== 'options' &&
                        `(${addon?.quantity} x ${currencyFormat(
                          addon?.unit_nett,
                          false,
                        )})`}
                    </Text>
                  </View>
                  <View
                    style={[
                      Styles.flex,
                      Styles.justifyContentBetween,
                      Styles.pb2,
                    ]}
                  >
                    <Text category="h5"></Text>
                    <Text category="h5" style={[Styles.textEnd]}>
                      {currencyFormat(
                        addon?.quantity > 0
                          ? addon?.quantity * addon?.unit_nett
                          : item?.quantity * addon?.unit_nett,
                        false,
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <Divider style={[Styles.bgSecondary]} />
        </View>

        <View style={[Styles.px5, Styles.pt4]}>
          {data?.subtotal_nett > data?.total_charges && (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text category="h5">Before Discount</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {currencyFormat(data?.subtotal_nett, false)}
                </Text>
              </View>
            </View>
          )}
          {discountMap?.length > 0 &&
            discountMap?.map((d, i) => (
              <View
                key={i}
                style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
              >
                <View>
                  <Text category="h5">Discount Category {d?.name}</Text>
                </View>
                <View>
                  <Text category="h5" style={[Styles.textEnd]}>
                    -{currencyFormat(d?.subtotal, false)}
                  </Text>
                </View>
              </View>
            ))}
          {data?.discount_value > 0 && (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text category="h5">Discount Order</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  -{currencyFormat(data?.discount_value, false)}
                </Text>
              </View>
            </View>
          )}
          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">Total</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {currencyFormat(data?.total_charges, false)}
              </Text>
            </View>
          </View>

          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text style={[Styles.textCapitalize]} category="h5">
                {data?.payment_method?.name || 'Cash'}
              </Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {currencyFormat(data?.total_payment, false)}
              </Text>
            </View>
          </View>

          {data?.payment_ref !== '' && (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text category="h5">Ref</Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {data?.payment_ref}
                </Text>
              </View>
            </View>
          )}

          {data?.total_payment - data?.total_charges > 0 ? (
            <View
              style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}
            >
              <View>
                <Text style={[Styles.textCapitalize]} category="h5">
                  Change
                </Text>
              </View>
              <View>
                <Text category="h5" style={[Styles.textEnd]}>
                  {currencyFormat(
                    data?.total_payment - data?.total_charges,
                    false,
                  )}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </ViewShot>
  );
};

export default Receipt;
