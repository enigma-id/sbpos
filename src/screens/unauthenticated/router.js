import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SigninScreen from './signin';
import ResetScreen from './reset';

const Stack = createNativeStackNavigator();

const UnauthorizedRouter = () => {
  return (
    <Stack.Navigator
      initialRouteName="signin"
      screenOptions={{
        headerShown: true,
        headerMode: 'screen',
        animation: 'slide_from_right',
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="signin"
        component={SigninScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="reset"
        component={ResetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UnauthorizedRouter;
