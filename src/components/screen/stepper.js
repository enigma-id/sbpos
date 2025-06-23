import {Button, Text} from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Styles} from '../theme/styles';

const QuantityStepper = ({value, onChange}) => {
  const increment = () => onChange(value + 1);
  const decrement = () => {
    onChange(value - 1);
  };

  return (
    <View
      style={[
        Styles.flex,
        Styles.alignItemsCenter,
        Styles.justifyContentBetween,
        Styles.border,
        Styles.rounded4,
        {minWidth: 120},
      ]}>
      <Button
        size="small"
        onPress={decrement}
        style={[Styles.rounded4]}
        status="info"
        disabled={value === 0}>
        -
      </Button>

      <Text category="h4">{value}</Text>

      <Button
        size="small"
        status="info"
        onPress={increment}
        style={[Styles.rounded4]}>
        +
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    minWidth: 130,
  },
});

export default QuantityStepper;
