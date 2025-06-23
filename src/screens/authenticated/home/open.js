import { View } from 'react-native';
import React from 'react';
import { Container, Content } from '../../../components/screen';
import { Button, Input, Text } from '@ui-kitten/components';
import { renderTitle } from '../../../components/utils/form';
import { Styles } from '../../../components/theme/styles';
import colors from '../../../components/theme/colors';
import useSession from '../../../services/sales/session/hook';

const OpenScreen = () => {
  const { start, startResult } = useSession();
  const [cash, setCash] = React.useState(0);
  const [cashStr, setCashStr] = React.useState(0);

  const onChange = input => {
    let cash_start_str = '';
    let cash_start = 0;

    if (typeof input === 'string') {
      cash_start_str = input;
      const clean = input.replace(/[^\d]/g, '');
      cash_start = Number(clean);

      if (isNaN(cash_start)) {
        cash_start = 0;
      }
    }

    setCashStr(cash_start_str);
    setCash(cash_start);
  };

  const onStart = async () => {
    const payload = {
      cash,
    };

    start(payload);
  };

  return (
    <Container>
      <Content>
        <View style={[Styles.px6, Styles.py4]}>
          <View
            style={[
              Styles.border,
              Styles.px4,
              Styles.py4,
              Styles.rounded2,
              Styles.mb5,
              { backgroundColor: colors.INFO_TRSP, borderColor: colors.INFO },
            ]}
          >
            <Text category="s1" style={[Styles.textCenter]}>
              Anda akan memulai sesi berjualan, semua transaksi yang terjadi
              dikelompokan kedalam sesi jualan, sehingga dapat memudahkan dalam
              pengontrolan kas.
            </Text>
          </View>

          <Input
            size="large"
            accessoryLeft={props => (
              <Text category="p2" {...props} style={[Styles.alignItemsCenter]}>
                Rp.
              </Text>
            )}
            value={cashStr}
            label={() =>
              renderTitle({
                val: 'Kas Awal',
                required: true,
              })
            }
            // caption={() => renderCaption(FormState?.errors?.username)}
            // status={FormState?.errors?.username ? "danger" : "basic"}
            onChangeText={v => onChange(v)}
            keyboardType="number-pad"
          />
          <Text category="c1">Input jumlah kas tunai modal awal</Text>
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
          size="small"
          status="primary"
          onPress={onStart}
          disabled={startResult?.isLoading}
        >
          MULAI SESI PENJUALAN
        </Button>
      </View>
    </Container>
  );
};

export default OpenScreen;
