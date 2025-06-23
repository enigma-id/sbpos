import React, { useState } from 'react';
import { Alert, Image, Modal, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, Card, Icon, Input, Text } from '@ui-kitten/components';

import useSession from '../../../services/sales/session/hook';
import { Styles } from '../../../components/theme/styles';
import { Container, Content } from '../../../components/screen';
import useKioskMode from '../../../components/utils/useKiosK';

const HomeScreen = () => {
  const router = useNavigation();
  const SalesSession = useSelector(state => state.SalesSession);
  const { summary } = useSession();

  const [pin, setPin] = useState('');
  const { pinModalVisible, checkPin, onLogoTap } = useKioskMode('46969', () => {
    setPin('');
  });

  useFocusEffect(
    React.useCallback(() => {
      summary();
    }, []),
  );

  const handlePOSPress = () => {
    if (SalesSession?.hasSession) {
      router.navigate('catalog');
    } else {
      Alert.alert('Sesi belum dibuka', 'Silakan buka sesi terlebih dahulu.');
    }
  };

  return (
    <Container>
      <Content onRefresh={null}>
        <View style={[Styles.px6, Styles.py4]}>
          <View
            style={[
              Styles.justifyContentCenter,
              Styles.alignItemsCenter,
              Styles.mt5,
            ]}
          >
            <TouchableOpacity onPress={onLogoTap}>
              <Image
                source={require('../../../assets/logo.png')}
                resizeMode="contain"
                style={{ width: 200, height: 100 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              Styles.flex,
              Styles.mt3,
              Styles.alignItemsCenter,
              Styles.justifyContentCenter,
              { flex: 1, flexWrap: 'wrap' },
            ]}
          >
            <Card
              style={[
                Styles.card,
                Styles.flex,
                Styles.alignItemsCenter,
                Styles.justifyContentCenter,
              ]}
              onPress={() => router.navigate('home/webview')}
            >
              <Icon name="bag-add-outline" style={Styles.cardIcon} />
              <Text style={Styles.cartTitle}>Pesan Bahan Baku</Text>
            </Card>
            <Card
              style={[
                Styles.card,
                Styles.flex,
                Styles.alignItemsCenter,
                Styles.justifyContentCenter,
              ]}
              onPress={handlePOSPress}
            >
              <Icon name="storefront-outline" style={Styles.cardIcon} />
              <Text style={Styles.cartTitle}>Point of Sales</Text>
            </Card>
            <Card
              style={[
                Styles.card,
                Styles.flex,
                Styles.alignItemsCenter,
                Styles.justifyContentCenter,
              ]}
              onPress={() => router.navigate('session')}
            >
              <Icon name="receipt-outline" style={Styles.cardIcon} />
              <Text style={Styles.cartTitle}>Penjualan</Text>
            </Card>
            <Card
              style={[
                Styles.card,
                Styles.flex,
                Styles.alignItemsCenter,
                Styles.justifyContentCenter,
              ]}
              onPress={() => router.navigate('profile')}
            >
              <Icon name="person-outline" style={Styles.cardIcon} />
              <Text style={Styles.cartTitle}>Akun</Text>
            </Card>
          </View>
        </View>
      </Content>

      <View style={[Styles.px6, Styles.py4]}>
        {SalesSession?.hasSession ? (
          <Button
            onPress={() => router.navigate('home/close')}
            style={{ marginBottom: 60 }}
            size="small"
            status="primary"
          >
            Tutup Sesi
          </Button>
        ) : (
          <Button
            onPress={() => router.navigate('home/open')}
            style={{ marginBottom: 60 }}
            size="small"
            status="primary"
          >
            Buka Sesi
          </Button>
        )}
      </View>

      {/* PIN Modal */}
      <Modal visible={pinModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000088',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
            }}
          >
            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Masukkan PIN Admin
            </Text>
            <Input
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                marginBottom: 20,
                borderRadius: 5,
              }}
            />
            <Button onPress={() => checkPin(pin)}>OK</Button>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default HomeScreen;
