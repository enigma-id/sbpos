import React from 'react';
import { Pressable, ToastAndroid, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  Button,
  Divider,
  Icon,
  Input,
  Text,
  Modal,
} from '@ui-kitten/components';

import useAuth from '../../../services/auth/hook';

import { Container, Content, Loading } from '../../../components/screen';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { renderCaption, renderTitle } from '../../../components/utils/form';
import { logout } from '../../../services/auth/slice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const router = useNavigation();
  const FormState = useSelector(state => state.Form);

  const { getUser, getUserResult, update, updateResult } = useAuth();

  const [name, setName] = React.useState('');
  const [toogleEdit, setToogleEdit] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [cPin, setCPin] = React.useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = React.useState(true);

  const [logoutModal, setLogoutModal] = React.useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
  };

  const renderIcon = props => (
    <Pressable onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
      />
    </Pressable>
  );

  const renderIcon1 = props => (
    <Pressable onPress={toggleSecureEntry1}>
      <Icon
        {...props}
        name={secureTextEntry1 ? 'eye-off-outline' : 'eye-outline'}
      />
    </Pressable>
  );

  const onSubmit = async () => {
    const payload = {
      name: name,
      password: pin,
      confirm_password: cPin,
    };

    update(payload);
  };

  const onLogout = () => {
    setLogoutModal(false);
    dispatch(logout());
  };

  React.useEffect(() => {
    if (updateResult.isSuccess) {
      ToastAndroid.show('Profil berhasil diperbarui', ToastAndroid.SHORT);
      setToogleEdit(false);
      setPin('');
      setCPin('');
    }
  }, [updateResult]);

  React.useEffect(() => {
    getUser();
  }, [updateResult.isSuccess]);

  React.useEffect(() => {
    let data = getUserResult?.data?.data?.user;

    setName(data?.name);
  }, [getUserResult]);

  React.useLayoutEffect(() => {
    router.setOptions({
      headerRight: () => (
        <Button
          size="tiny"
          status="danger"
          onPress={() => setLogoutModal(true)}
          accessoryLeft={props => <Icon {...props} name="power-outline" />}
        />
      ),
    });
  }, [router]);

  if (getUserResult.isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content>
        <View style={[Styles.px6, Styles.py4]}>
          <Text
            category="s2"
            style={[
              Styles.textUppercase,
              Styles.textGrey,
              { letterSpacing: 1, fontWeight: 'bold' },
            ]}
          >
            INFORMASI PENGGUNA
          </Text>
        </View>

        <View style={[Styles.px6, Styles.py4, Styles.bgWhite]}>
          <Input
            style={[Styles.pb3]}
            textStyle={[Styles.fs3]}
            size="large"
            value={name}
            label={() =>
              renderTitle({
                val: 'Nama Pengguna',
              })
            }
            caption={() => renderCaption(FormState?.errors?.name)}
            status={FormState?.errors?.name ? 'danger' : 'basic'}
            onChangeText={v => setName(v)}
          />
        </View>

        <View
          style={[
            Styles.px6,
            Styles.py4,
            Styles.flex,
            Styles.justifyContentBetween,
            Styles.alignItemsCenter,
          ]}
        >
          <Button
            size="tiny"
            disabled={toogleEdit}
            onPress={() => setToogleEdit(true)}
          >
            Ganti PIN
          </Button>
          <Button
            size="tiny"
            status="danger"
            disabled={!toogleEdit}
            onPress={() => {
              setToogleEdit(false);
              setCPin('');
              setPin('');
            }}
          >
            Batal
          </Button>
        </View>

        {toogleEdit && (
          <View style={[Styles.px6, Styles.py4, Styles.bgWhite]}>
            <Input
              disabled={!toogleEdit}
              style={[Styles.pb3]}
              textStyle={[Styles.fs3]}
              size="large"
              value={pin}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry={secureTextEntry}
              label={() =>
                renderTitle({
                  val: 'PIN Baru 6 Angka',
                })
              }
              caption={() => renderCaption(FormState?.errors?.password)}
              status={FormState?.errors?.name ? 'danger' : 'basic'}
              onChangeText={v => setPin(v)}
              accessoryRight={renderIcon}
            />

            <Input
              disabled={!toogleEdit}
              style={[Styles.pb3]}
              textStyle={[Styles.fs3]}
              keyboardType="numeric"
              size="large"
              value={cPin}
              maxLength={6}
              secureTextEntry={secureTextEntry1}
              accessoryRight={renderIcon1}
              label={() =>
                renderTitle({
                  val: 'Konfirmasi PIN',
                })
              }
              caption={() => renderCaption(FormState?.errors?.confirm_password)}
              status={FormState?.errors?.name ? 'danger' : 'basic'}
              onChangeText={v => setCPin(v)}
            />
          </View>
        )}
      </Content>

      <View
        style={[
          Styles.bgWhite,
          Styles.px6,
          Styles.py4,
          { borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <Button
          size="small"
          status="success"
          onPress={onSubmit}
          disabled={updateResult?.isLoading}
        >
          SIMPAN
        </Button>
      </View>

      <Modal
        visible={logoutModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => {
          setLogoutModal(false);
        }}
      >
        <View
          style={[
            Styles.bgWhite,
            { borderRadius: 10, width: DEVICE_WIDTH / 1.1 },
          ]}
        >
          <View style={[Styles.px5, Styles.py5]}>
            <Text style={[Styles.textCenter]} category="h3" status="danger">
              Keluar Akun
            </Text>
          </View>
          <Divider />
          <View style={[Styles.px5, Styles.py5]}>
            <Text style={[Styles.textCenter, Styles.my3]} category="p2">
              Anda yakin akan keluar dari akun ini?
            </Text>
          </View>
          <View style={[Styles.flex]}>
            <View style={{ flex: 1 }}>
              <Button
                size="small"
                style={{ borderRadius: 0, borderBottomLeftRadius: 10 }}
                onPress={() => onLogout()}
              >
                KONFIRMASI
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                size="small"
                status="control"
                style={[Styles.textDanger]}
                onPress={() => {
                  setLogoutModal(false);
                }}
              >
                BATAL
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default ProfileScreen;
