import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const Container = props => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.BACKGROUND,
          }}
        >
          {props.children}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Container;
