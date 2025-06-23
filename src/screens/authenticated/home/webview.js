import React from 'react';
import { Container, Content } from '../../../components/screen';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

const WebScreen = () => {
  const username = useSelector(state => state.Auth?.session?.user?.username);
  return (
    <Container>
      <WebView
        source={{
          uri: `https://order.sukabread.com/?source=share&username=${username}`,
        }}
        style={{ flex: 1 }}
      />
    </Container>
  );
};

export default WebScreen;
