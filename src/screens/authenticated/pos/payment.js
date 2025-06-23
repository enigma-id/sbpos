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

  const { checkout, checkoutResult, method } = useCart();

  const [paymentRef, setPaymentRef] = React.useState('');
  const [totalPaymentStr, setPaymentStr] = React.useState('');
  const [totalPayment, setTotalPayment] = React.useState(0);
  const [moneyList, setMoneyList] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (payment?.id === 'cash') {
      const list = cashList(Cart?.subtotal);
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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      channel_id: Channel?.selectedChannel?.id,
      status: 'completed',
      payment_method_id: payment?.id === 'cash' ? 0 : payment?.id,
      payment_ref: payment?.id === 'cash' ? '' : paymentRef,
      note: '',
      items: Cart?.items,
      total_payment:
        payment?.id === 'cash' ? totalPayment || 0 : Cart?.subtotal || 0,
    };

    // await checkout(payload);
    method();

    setIsSubmitting(false);
  };

  return (
    <Container>
      <Content onRefresh={null}>
        <View style={[Styles.px6, Styles.py4]}>
          {payment?.id === 'cash' ? (
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
                    onPress={() => onChange(Cart?.subtotal)}
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
