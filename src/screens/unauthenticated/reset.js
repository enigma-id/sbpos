import React from 'react';
import { View } from 'react-native';
import { Container, Content } from '../../components/screen';
import { Text } from '@ui-kitten/components';

const ResetScreen = () => {
  return (
    <Container>
      <Content>
        <View>
          <Text>
            Input Nomor Handphone Anda, {'\n'} dan tunggu SMS untuk mendapatkan
            PIN Baru!
          </Text>
        </View>
      </Content>
    </Container>
  );
};

export default ResetScreen;
