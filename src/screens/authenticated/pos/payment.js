import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon, Input, Text } from '@ui-kitten/components';

import { Container, Content } from '../../../components/screen';
import { cashList, currencyFormat } from '../../../components/utils/common';
import { Styles } from '../../../components/theme/styles';
import { renderCaption } from '../../../components/utils/form';
import useCart from '../../../services/cart/hook';

const PaymentScreen = props => {
  const Cart = useSelector(state => state?.Cart);
  const Channel = useSelector(state => state?.SalesChannel);
  const FormState = useSelector(state => state?.Form);

  const payment = props?.route?.params?.method;

  const { checkout, checkoutResult } = useCart();

  const [paymentRef, setPaymentRef] = React.useState('');
  const [totalPaymentStr, setPaymentStr] = React.useState('');
  const [totalPayment, setTotalPayment] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [moneyList, setMoneyList] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (payment?.id === 0) {
      const list = cashList(Cart?.meta?.grand_total);
      setMoneyList(list);
    }
  }, [Cart, payment]);

  const onChange = i => {
    let total_payment_str = '';
    let total_payment = 0;

    if (typeof i === 'string') {
      total_payment_str = i;
      total_payment = parseFloat(i.replace(/[^\d.]/g, ''));
    } else {
      total_payment = i;
      total_payment_str = new Intl.NumberFormat('id-ID').format(total_payment);
    }

    setPaymentStr(total_payment_str);
    setTotalPayment(total_payment);
  };

  const generatePayload = () => {
    const items = (Cart?.items?.list ?? []).map(item => {
      const base = {
        catalog_id: item.catalog_id,
        quantity: item.quantity,
      };

      if (item?.additionals_flat?.length > 0) {
        base.additionals = item.additionals_flat;
      }

      if (item?.is_custom === 1) {
        base.description = item.name;
        base.unit_price = item.unit_price;
      }

      return base;
    });

    const discount_categories = (Cart?.discount?.category ?? [])
      .filter(
        cat =>
          cat?.discount_value > 0 &&
          ['percentage', 'nominal'].includes(cat?.discount_type),
      )
      .map(cat => ({
        category_id: cat.id,
        ...(cat.discount_type === 'percentage'
          ? { discount_percentage: cat.discount_value }
          : { discount_value: cat.discount_value }),
      }));

    const payload = {
      channel_id: Channel?.selectedChannel?.id,
      payment_method_id: payment?.id,
      payment_ref: payment?.id === 0 ? '' : paymentRef,
      note: note ?? '',
      items,
      total_payment:
        payment?.id === 0 ? totalPayment || 0 : Cart?.meta?.grand_total || 0,
    };

    if (Cart?.meta?.customer) {
      payload.membership_id = Cart.meta.customer.id;
    }

    if (Cart?.discount?.cart?.type === 'percentage') {
      payload.discount_percentage = Cart.discount.cart.value;
    }

    if (Cart?.discount?.cart?.type === 'nominal') {
      payload.discount_value = Cart.discount.cart.value;
    }

    if (discount_categories.length > 0) {
      payload.discount_categories = discount_categories;
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = generatePayload();

    await checkout(payload);

    setIsSubmitting(false);
  };

  return (
    <Container>
      <Content onRefresh={null}>
        <View style={[Styles.px6, Styles.py4]}>
          <Input
            size="large"
            value={note}
            style={[Styles.pb4]}
            label={() => (
              <Text
                category="s2"
                style={[
                  Styles.textUppercase,
                  Styles.textGrey,
                  Styles.pb4,
                  { letterSpacing: 1, fontWeight: 'bold' },
                ]}
              >
                Customer
              </Text>
            )}
            status={FormState?.errors?.note ? 'danger' : 'basic'}
            onChangeText={v => setNote(v)}
          />

          {payment?.id === 0 ? (
            <>
              <Text
                category="s2"
                style={[
                  Styles.textUppercase,
                  Styles.textGrey,
                  Styles.pb4,
                  { letterSpacing: 1, fontWeight: 'bold' },
                ]}
              >
                Pembayaran Diterima
              </Text>
              <View
                style={[
                  Styles.flex,
                  Styles.pb4,
                  Styles.mb4,
                  { flexWrap: 'wrap', gap: 5 },
                ]}
              >
                {moneyList?.map((money, i) => (
                  <Button
                    onPress={() => onChange(money)}
                    key={i}
                    size="small"
                    appearance="outline"
                  >
                    <Text>{currencyFormat(money)}</Text>
                  </Button>
                ))}
              </View>
              <Input
                size="large"
                accessoryLeft={props => (
                  <Text
                    category="p2"
                    {...props}
                    style={[Styles.alignItemsCenter]}
                  >
                    Rp.
                  </Text>
                )}
                value={totalPaymentStr}
                style={[Styles.pb3]}
                label={() => (
                  <Text
                    category="s2"
                    style={[
                      Styles.textUppercase,
                      Styles.textGrey,
                      Styles.pb4,
                      { letterSpacing: 1, fontWeight: 'bold' },
                    ]}
                  >
                    Uang diterima
                  </Text>
                )}
                status={FormState?.errors?.total_payment ? 'danger' : 'basic'}
                caption={() => renderCaption(FormState?.errors?.total_payment)}
                keyboardType="number-pad"
                onChangeText={v => onChange(v)}
                accessoryRight={() => (
                  <Button
                    size="tiny"
                    status="primary"
                    onPress={() => onChange(Cart?.meta?.grand_total)}
                  >
                    Uang Pas
                  </Button>
                )}
              />
            </>
          ) : (
            <Input
              size="large"
              value={paymentRef}
              style={[Styles.pb3]}
              label={() => (
                <Text
                  category="s2"
                  style={[
                    Styles.textUppercase,
                    Styles.textGrey,
                    Styles.pb4,
                    { letterSpacing: 1, fontWeight: 'bold' },
                  ]}
                >
                  Kode Transaksi
                </Text>
              )}
              status={FormState?.errors?.payment_ref ? 'danger' : 'basic'}
              caption={() => renderCaption('* Tidak wajib diisi')}
              onChangeText={v => setPaymentRef(v)}
            />
          )}
        </View>
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
          onPress={handleSubmit}
          size="small"
          status="success"
          accessoryLeft={props => (
            <Icon {...props} name="shield-checkmark-outline" />
          )}
          disabled={isSubmitting || checkoutResult?.isLoading}
        >
          KONFIRMASI
        </Button>
      </View>
    </Container>
  );
};

export default PaymentScreen;
