import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';
import colors from '../theme/colors';
import { DEVICE_HEIGHT, Styles } from '../theme/styles';

const EmptyScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: DEVICE_HEIGHT - 100,
      }}
    >
      <Icon
        name="sad-outline"
        style={{ width: 100, height: 100, color: colors.SECONDARY_TRSP }}
      />
      <Text category="h4" style={[Styles.mt4, Styles.textCapitalize]}>
        belum ada data
      </Text>
    </View>
  );
};

export default EmptyScreen;
