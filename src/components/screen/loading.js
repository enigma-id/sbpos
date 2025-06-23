import {View} from 'react-native';
import React from 'react';
import {CircularProgressBar, Text} from '@ui-kitten/components';

const Loading = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <CircularProgressBar progress={100} size="large" status="primary" />
      <Text style={{marginTop: 10}}>Memuat data...</Text>
    </View>
  );
};

export default Loading;
