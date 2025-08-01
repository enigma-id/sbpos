import { Button, Input } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import { Styles } from '../theme/styles';

const QuantityStepper = ({ value, onChange, small }) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(0, value - 1));

  const handleInputChange = nextVal => {
    const numeric = parseInt(nextVal.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numeric)) {
      onChange(numeric);
    } else {
      onChange(0);
    }
  };

  return (
    <View
      style={[
        Styles.flex,
        Styles.alignItemsCenter,
        Styles.justifyContentBetween,
        Styles.border,
        Styles.rounded4,
        { width: small ? 120 : 200 },
      ]}
    >
      <Button
        size={small ? 'tiny' : 'small'}
        onPress={decrement}
        style={[Styles.rounded4]}
        status="info"
        disabled={value === 0}
      >
        -
      </Button>

      <Input
        value={value.toString()}
        keyboardType="number-pad"
        onChangeText={handleInputChange}
        style={{
          borderWidth: 0,
          backgroundColor: 'transparent',
          textAlign: 'center',
        }}
        size="small"
        textStyle={{ textAlign: 'center', fontSize: small ? 14 : 16 }}
      />

      <Button
        size={small ? 'tiny' : 'small'}
        status="info"
        onPress={increment}
        style={[Styles.rounded4]}
      >
        +
      </Button>
    </View>
  );
};

export default QuantityStepper;
