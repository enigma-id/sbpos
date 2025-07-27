import { Divider, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import { Image, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Styles } from '../theme/styles';
import { currencyFormat, dateFormat } from '../utils/common';

const Receipt = ({ data, onLoaded }) => {
  const [load, setLoad] = React.useState(true);

  const onCapture = uri => {
    onLoaded(uri);
    setLoad(false);
  };

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

          {/* <Text
            style={[Styles.textUppercase, {letterSpacing: 1}]}
            category="p1">
            {data?.session?.outlet?.brand?.name || null}
          </Text>
          <Text
            style={[Styles.textUppercase, {letterSpacing: 1}]}
            category="p1">
            {data?.session?.outlet?.name || null}
          </Text>
          <Text
            style={[Styles.textUppercase, {letterSpacing: 1}]}
            category="c2">
            {data?.channel?.name || null}
          </Text> */}
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
              <Text category="h5">Transaksi</Text>
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
          <View style={[Styles.flex, Styles.justifyContentBetween]}>
            <View>
              <Text category="h5">Kasir</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {data?.session?.cashier?.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={[Styles.px5, Styles.pt4]}>
          <View style={[Styles.flex, Styles.justifyContentBetween]}>
            <View>
              <Text category="h5">Deskripsi</Text>
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

          {data?.items?.map((item, index) =>
            item?.additional_id === null ? (
              <View
                style={[Styles.flex, Styles.justifyContentBetween]}
                key={index}
              >
                <View style={[Styles.flex, Styles.justifyContentBetween]}>
                  <View>
                    <Text category="h5">{item?.catalog?.name}</Text>

                    <Text category="h5">
                      @ {currencyFormat(item?.unit_nett, false)} x{' '}
                      {item?.quantity}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    Styles.flex,
                    Styles.justifyContentBetween,
                    Styles.pb2,
                  ]}
                >
                  <Text category="h5" style={[Styles.textEnd]}>
                    {currencyFormat(item?.unit_nett * item?.quantity, false)}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[Styles.flex, Styles.justifyContentBetween]}
                key={index}
              >
                <View style={[Styles.flex, Styles.justifyContentBetween]}>
                  <View>
                    <Text category="h5">
                      &nbsp; &nbsp; {item?.catalog?.name}
                    </Text>
                    <Text category="h5">
                      &nbsp; &nbsp; @ {currencyFormat(item?.unit_nett, false)} x{' '}
                      {item?.quantity}
                    </Text>
                  </View>
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
            ),
          )}

          <Divider style={[Styles.bgSecondary, Styles.mb4]} />
        </View>
        <View style={[Styles.px5, Styles.pt4]}>
          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text category="h5">TOTAL</Text>
            </View>
            <View>
              <Text category="h5" style={[Styles.textEnd]}>
                {currencyFormat(data?.total_charges, false)}
              </Text>
            </View>
          </View>

          <View style={[Styles.flex, Styles.justifyContentBetween, Styles.pb2]}>
            <View>
              <Text style={[Styles.textUppercase]} category="h5">
                {data?.payment_method?.name || 'cash'}
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
                <Text category="h5">REF</Text>
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
                <Text style={[Styles.textUppercase]} category="h5">
                  Kembalian
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
