import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Styles } from '../../components/theme/styles';

import HomeScreen from './home';
import OpenScreen from './home/open';
import CloseScreen from './home/close';
import HistoryScreen from './transaction/history';
import DetailScreen from './transaction/detail';
import CatalogScreen from './pos/catalog';
import CartScreen from './pos/cart';
import CheckoutScreen from './pos/checkout';
import PaymentScreen from './pos/payment';
import ConfirmationScreen from './pos/confirmation';
import ProfileScreen from './profile';
import SessionScreen from './transaction/session';
import WebScreen from './home/webview';

const { Navigator, Screen, Group } = createNativeStackNavigator();

export const AuthorizedRouter = () => {
  return (
    <Navigator
      initialRouteName="home"
      screenOptions={{
        headerMode: 'screen',
        animation: 'slide_from_bottom',
      }}
    >
      <Group screenOptions={{ presentation: 'card' }}>
        <Screen
          name="home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="home/open"
          component={OpenScreen}
          options={{
            title: 'Sesi Penjualan',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="home/close"
          component={CloseScreen}
          options={{
            title: 'Ringkasan Penjualan',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="home/webview"
          component={WebScreen}
          options={{
            title: 'Pesan bahan baku',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="catalog"
          component={CatalogScreen}
          options={{
            title: 'Katalog',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
            headerShown: false,
          }}
        />
        <Screen
          name="cart"
          component={CartScreen}
          options={{
            title: 'Detil Katalog',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="checkout"
          component={CheckoutScreen}
          options={{
            title: 'Keranjang',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="payment"
          component={PaymentScreen}
          options={{
            title: 'Konfirmasi Pembayaran',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />

        <Screen
          name="confirmation"
          component={ConfirmationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="session"
          component={SessionScreen}
          options={{
            title: 'Sesi Penjualan',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="transaction"
          component={HistoryScreen}
          options={{
            title: 'Transaksi Penjualan',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="transaction/detail"
          getId={({ params }) => params.id}
          component={DetailScreen}
          options={{
            title: 'Detail Penjualan',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
        <Screen
          name="profile"
          component={ProfileScreen}
          options={{
            title: 'Akun',
            animationDuration: 10,
            headerTitleStyle: {
              ...Styles.fs3,
            },
          }}
        />
      </Group>
    </Navigator>
  );
};
