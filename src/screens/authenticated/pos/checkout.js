import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Text,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { Container } from '../../../components/screen';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { currencyFormat } from '../../../components/utils/common';
import useCart from '../../../services/cart/hook';
import useSession from '../../../services/sales/session/hook';
import { useLazySummaryQuery } from '../../../services/sales/session/action';

const CheckoutScreen = () => {
  const router = useNavigation();
  const Cart = useSelector(state => state?.Cart);
  // const { paymentMethod, method, methodResult, reset } = useCart();
  const [triggerSummary, summaryResult] = useLazySummaryQuery();

  const hasCalled = React.useRef(false);

  // const [selectedMethodIndex, setSelectedMethodIndex] = React.useState(0);

  // const methodOptions = React.useMemo(() => {
  //   const fromApi = paymentMethod ?? [];
  //   return [{ id: 'cash', name: 'Tunai' }, ...fromApi];
  // }, [paymentMethod]);

  // const onPay = () => {
  //   const selectedMethod = methodOptions[selectedMethodIndex];

  //   router.navigate('payment', {
  //     method: selectedMethod,
  //   });
  // };

  const req = async () => {
    try {
      await triggerSummary();
    } catch (error) {}
  };

  React.useEffect(() => {
    if (!hasCalled.current) {
      req();
      hasCalled.current = true;
    }
  }, []);

  return (
    <Container>
      {/* <List
        data={Cart?.items}
        ListHeaderComponent={() => (
          <View
            style={[
              Styles.px6,
              Styles.py4,
              Styles.flex,
              Styles.alignItemsCenter,
              Styles.justifyContentBetween,
            ]}
          >
            <Text
              category="s2"
              style={[
                Styles.textUppercase,
                Styles.textGrey,
                { letterSpacing: 1, fontWeight: 'bold' },
              ]}
            >
              RINCIAN BARANG
            </Text>

            <Text
              category="s2"
              style={[
                Styles.textUppercase,
                Styles.textGrey,
                { letterSpacing: 1, fontWeight: 'bold' },
              ]}
            >
              {Cart?.count} BARANG
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View key={index}>
            <ListItem
              onPress={() => router.navigate('cart', { catalog: item })}
              style={[Styles.px6, Styles.py4]}
              accessoryLeft={props => (
                <Icon
                  style={{ width: 20, height: 20, marginEnd: 5 }}
                  name="create-outline"
                />
              )}
              title={() => <Text category="h5">{item?.name}</Text>}
              description={() => (
                <Text category="c2">
                  @ {currencyFormat(item?.unit_price || 0)}
                </Text>
              )}
              accessoryRight={() => (
                <View
                  style={[
                    Styles.flex,
                    Styles.alignItemsCenter,
                    Styles.justifyContentCenter,
                  ]}
                >
                  <View
                    style={[
                      Styles.bgNotification,
                      Styles.me3,
                      Styles.rounded3,
                      Styles.alignItemsCenter,
                      Styles.justifyContentCenter,
                      { width: 25, height: 25 },
                    ]}
                  >
                    <Text category="h5">{item?.quantity}</Text>
                  </View>
                  <Text category="h5">
                    {currencyFormat(item?.unit_price * item?.quantity)}
                  </Text>
                </View>
              )}
            />
            {item?.toppings &&
              item?.toppings?.map(
                (t, i) =>
                  t?.quantity > 0 && (
                    <ListItem
                      onPress={() => router.navigate('cart', { catalog: item })}
                      key={i}
                      style={[Styles.px6, Styles.py4, { paddingLeft: 60 }]}
                      title={() => <Text category="h6">{t?.name}</Text>}
                      description={() => (
                        <Text category="c1">
                          @ {currencyFormat(t?.unit_price || 0)}
                        </Text>
                      )}
                      accessoryRight={() => (
                        <View
                          style={[
                            Styles.flex,
                            Styles.alignItemsCenter,
                            Styles.justifyContentCenter,
                          ]}
                        >
                          <View
                            style={[
                              Styles.bgNotification,
                              Styles.me3,
                              Styles.rounded3,
                              Styles.alignItemsCenter,
                              Styles.justifyContentCenter,
                              { width: 25, height: 25 },
                            ]}
                          >
                            <Text category="h5">{t?.quantity}</Text>
                          </View>
                          <Text category="h5">
                            {currencyFormat(t?.unit_price * t?.quantity)}
                          </Text>
                        </View>
                      )}
                    />
                  ),
              )}
          </View>
        )}
        ItemSeparatorComponent={Divider}
        // ListFooterComponent={() => (
        //   <View style={[Styles.mb5]}>
        //     <View style={[Styles.px6, Styles.py4, Styles.mt5]}>
        //       <Text
        //         category="s2"
        //         style={[
        //           Styles.textUppercase,
        //           Styles.textGrey,
        //           { letterSpacing: 1, fontWeight: 'bold' },
        //         ]}
        //       >
        //         Metode Pembayaran
        //       </Text>
        //     </View>

        //     {methodOptions && methodOptions.length > 0 && (
        //       <RadioGroup
        //         selectedIndex={selectedMethodIndex}
        //         onChange={index => setSelectedMethodIndex(index)}
        //         style={[Styles.bgWhite]}
        //       >
        //         {methodOptions.map((method, index) => (
        //           <Radio
        //             status="primary"
        //             key={index}
        //             style={[
        //               Styles.px6,
        //               Styles.py4,
        //               Styles.borderBottom,
        //               { gap: 20, marginBottom: 0, marginTop: 0 },
        //             ]}
        //           >
        //             {evaProps => (
        //               <Text category="s1" style={{ fontWeight: 'bold' }}>
        //                 {method?.name}
        //               </Text>
        //             )}
        //           </Radio>
        //         ))}
        //       </RadioGroup>
        //     )}
        //   </View>
        // )}
      /> */}

      {/* <View
        style={[
          Styles.px6,
          Styles.bgWhite,
          Styles.py3,
          { borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <View
          style={[
            Styles.flex,
            Styles.alignItemsCenter,
            Styles.justifyContentBetween,
            Styles.mb5,
            Styles.pt2,
          ]}
        >
          <Text category="p2" style={[Styles.textStart]}>
            Total Pembayaran
          </Text>
          <Text category="h4" status="primary" style={[Styles.textEnd]}>
            {currencyFormat(Cart?.subtotal)}
          </Text>
        </View>
        <View
          style={[
            Styles.flex,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
            { gap: 10 },
          ]}
        >
          <View style={{ width: DEVICE_WIDTH / 3.1 }}>
            <Button size="small" status="danger" onPress={reset}>
              <Text numberOfLines={1} style={{ textAlign: 'center' }}>
                BATALKAN
              </Text>
            </Button>
          </View>
          <View style={{ width: DEVICE_WIDTH / 1.8 }}>
            <Button
              disabled={Cart?.count === 0}
              size="small"
              status="success"
              accessoryLeft={props => (
                <Icon {...props} name="shield-checkmark-outline" />
              )}
              onPress={() => onPay()}
            >
              Bayar Sekarang
            </Button>
          </View>
        </View>
      </View> */}
    </Container>
  );
};

export default CheckoutScreen;
