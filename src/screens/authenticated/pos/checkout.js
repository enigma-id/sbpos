import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  Icon,
  ListItem,
  Radio,
  RadioGroup,
  Text,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { Container, Content } from '../../../components/screen';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { currencyFormat } from '../../../components/utils/common';
import useCart from '../../../services/cart/hook';
import DiscountSection from './discount';

const CheckoutScreen = () => {
  const router = useNavigation();
  const Cart = useSelector(state => state?.Cart);
  const CartItems = useSelector(state => state?.Cart?.items);

  const { getPaymentMethod, reset } = useCart();

  const [items, setItems] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState([]);
  const [selectedMethodIndex, setSelectedMethodIndex] = React.useState(0);

  const onPay = () => {
    const selectedMethod = filteredMethods[selectedMethodIndex];

    router.navigate('payment', {
      method: selectedMethod,
    });
  };

  const filteredMethods = paymentMethod.filter(
    method => method?.name !== 'Kartu Suka Bread',
  );

  React.useEffect(() => {
    const getMethod = async () => {
      const res = await getPaymentMethod();
      setPaymentMethod(res);
    };

    getMethod();
  }, []);

  React.useEffect(() => {
    setItems(CartItems?.list ?? []);
  }, [CartItems]);

  return (
    <Container>
      <Content>
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
            {CartItems?.count} BARANG
          </Text>
        </View>
        <View>
          {items.length > 0
            ? items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    router.navigate('cart', {
                      catalog: item,
                      mode: 'edit',
                      editKey: index,
                    })
                  }
                  style={{ borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                >
                  <ListItem
                    disabled
                    style={[Styles.px6, Styles.py4]}
                    title={() => <Text category="h5">{item?.name}</Text>}
                    description={() => (
                      <Text category="c2">
                        {item?.quantity} x{' '}
                        {item?.discount_amount > 0
                          ? currencyFormat(
                              item?.unit_price -
                                item?.discount_amount / item.quantity >
                                0
                                ? item?.unit_price -
                                    item?.discount_amount / item.quantity
                                : 0,
                              false,
                            )
                          : currencyFormat(item?.unit_price, false)}{' '}
                        {item?.discount_amount > 0 && (
                          <Text
                            category="s2"
                            style={{ textDecorationLine: 'line-through' }}
                          >
                            {currencyFormat(item?.unit_price, false)}
                          </Text>
                        )}
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
                        {/* <View
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
                        </View> */}
                        <Text category="p2">
                          {currencyFormat(
                            item?.quantity *
                              (item?.discount_amount > 0
                                ? item?.unit_price -
                                    item?.discount_amount / item.quantity >
                                  0
                                  ? item?.unit_price -
                                    item?.discount_amount / item.quantity
                                  : 0
                                : item?.unit_price),
                            false,
                          )}
                        </Text>
                      </View>
                    )}
                  />
                  {(item?.additionals || [])
                    .map(add => {
                      const selectedChilds = (add?.childs || []).filter(child =>
                        add.type === 'quantity'
                          ? (child?.quantity || 0) > 0
                          : !!child?.selected,
                      );

                      if (selectedChilds.length === 0) return null;

                      const childNames = selectedChilds.map(child => {
                        const suffix =
                          add?.type === 'quantity' || add?.type === 'checkbox'
                            ? `(${item?.quantity} x ${
                                child?.quantity
                              }) x ${currencyFormat(
                                child?.unit_price,
                                false,
                                0,
                              )} `
                            : '';

                        return (
                          <ListItem
                            disabled
                            key={child?.id}
                            style={{ paddingVertical: 2, paddingHorizontal: 0 }}
                            description={() => (
                              <Text category="c1">
                                + {child?.name} {suffix}
                              </Text>
                            )}
                            accessoryRight={() => (
                              <Text category="c1">
                                {currencyFormat(
                                  item?.quantity *
                                    child?.quantity *
                                    child?.unit_price,
                                  false,
                                  0,
                                )}
                              </Text>
                            )}
                          />
                        );
                      });

                      return (
                        <View
                          key={add?.id}
                          style={[Styles.px6, Styles.py2, Styles.bgWhite]}
                        >
                          <Text category="h6">{add?.name}</Text>
                          <View>{childNames}</View>
                        </View>
                      );
                    })
                    .filter(Boolean)}

                  <View style={[Styles.px6, Styles.py2, Styles.bgWhite]}>
                    {item?.discount_amount > 0 ? (
                      <Text
                        category="h4"
                        style={{ textAlign: 'right', color: '#EE6615' }}
                      >
                        <Text
                          category="s2"
                          style={{
                            textDecorationLine: 'line-through',
                          }}
                        >
                          {currencyFormat(item?.subtotal, false)}{' '}
                        </Text>
                        {currencyFormat(item?.final_total, false)}
                      </Text>
                    ) : (
                      <Text
                        category="h4"
                        style={{ textAlign: 'right', color: '#EE6615' }}
                      >
                        {currencyFormat(item?.subtotal, false)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </View>

        <View style={[Styles.mb5]}>
          <DiscountSection />

          <View style={[Styles.px6, Styles.py4, Styles.mt5]}>
            <Text
              category="s2"
              style={[
                Styles.textUppercase,
                Styles.textGrey,
                { letterSpacing: 1, fontWeight: 'bold' },
              ]}
            >
              Metode Pembayaran
            </Text>
          </View>

          {filteredMethods && filteredMethods.length > 0 && (
            <RadioGroup
              selectedIndex={selectedMethodIndex}
              onChange={index => setSelectedMethodIndex(index)}
              style={[Styles.bgWhite]}
            >
              {filteredMethods.map((method, index) => (
                <Radio
                  status="primary"
                  key={index}
                  style={[
                    Styles.px6,
                    Styles.py4,
                    Styles.borderBottom,
                    { gap: 20, marginBottom: 0, marginTop: 0 },
                  ]}
                >
                  {evaProps => (
                    <Text category="s1" style={{ fontWeight: 'bold' }}>
                      {method?.name}
                    </Text>
                  )}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </View>
      </Content>

      <View
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
          <View>
            {Cart?.meta?.subtotal > Cart?.meta?.grand_total ? (
              <Text
                category="s2"
                style={{
                  textDecorationLine: 'line-through',
                  textAlign: 'right',
                }}
              >
                {currencyFormat(Cart?.meta?.subtotal, false)}
              </Text>
            ) : null}

            <Text category="h4" status="primary" style={[Styles.textEnd]}>
              {currencyFormat(Cart?.meta?.grand_total)}
            </Text>
          </View>
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
      </View>
    </Container>
  );
};

export default CheckoutScreen;
