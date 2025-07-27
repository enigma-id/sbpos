/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import {
  Image,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Button, Icon, Input, Text } from '@ui-kitten/components';

import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  Styles,
} from '../../components/theme/styles';
import { renderCaption, renderTitle } from '../../components/utils/form';

import useAuth from '../../services/auth/hook';
import { Container, Content } from '../../components/screen';
import useKioskMode from '../../components/utils/useKiosK';

const SigninScreen = () => {
  const FormState = useSelector(state => state?.Form);
  const { signin, loginResult } = useAuth();

  const { pinModalVisible, checkPin, onLogoTap } = useKioskMode('46969', () => {
    setPin('');
  });

  const [pin, setPin] = React.useState('');

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const $handleSubmit = async () => {
    const payload = {
      username: username,
      password: password,
    };

    signin(payload);
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = props => (
    <Pressable onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
      />
    </Pressable>
  );

  return (
    <Container>
      <Content onRefresh={null}>
        <View
          style={[
            Styles.bgSecondary,
            Styles.justifyContentCenter,
            { flex: 1, minHeight: DEVICE_HEIGHT, minWidth: DEVICE_WIDTH },
          ]}
        >
          <View style={[Styles.justifyContentCenter, Styles.alignItemsCenter]}>
            <TouchableOpacity onPress={onLogoTap}>
              <Image
                source={require('../../assets/suka_bread_white_logo.png')}
                resizeMode="center"
                style={{ width: 240, height: 120 }}
              />
            </TouchableOpacity>
          </View>

          <View style={[Styles.px5, Styles.py5]}>
            <Input
              style={[Styles.pb3]}
              textStyle={[Styles.fs3]}
              size="large"
              value={username}
              label={() =>
                renderTitle({
                  val: 'Username',
                  required: true,
                  mode: 'light',
                })
              }
              caption={() => renderCaption(FormState?.errors?.username)}
              status={FormState?.errors?.username ? 'danger' : 'basic'}
              onChangeText={v => setUsername(v)}
              keyboardType="phone-pad"
            />
            <Input
              style={[Styles.pb3]}
              textStyle={[Styles.fs3]}
              size="large"
              value={password}
              label={() =>
                renderTitle({
                  val: 'PIN',
                  required: true,
                  mode: 'light',
                })
              }
              caption={() => renderCaption(FormState?.errors?.password)}
              status={FormState?.errors?.password ? 'danger' : 'basic'}
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={v => setPassword(v)}
              returnKeyType="done"
              keyboardType="number-pad"
            />

            {/* <Pressable
              style={[
                Styles.flex,
                Styles.alignItemsEnd,
                Styles.justifyContentEnd,
              ]}
              onPress={() => router?.navigate('reset')}
            >
              <Text
                category="p1"
                status="control"
                style={[Styles.mt1, Styles.textCapitalize, Styles.inputTitle]}
              >
                Lupa password ?
              </Text>
            </Pressable> */}
            <Button
              style={[Styles.mt5]}
              onPress={$handleSubmit}
              disabled={loginResult?.isLoading}
              status="primary"
            >
              MASUK
            </Button>
          </View>
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
      </Content>
    </Container>
  );
};

export default SigninScreen;
