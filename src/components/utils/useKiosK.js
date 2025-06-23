import { useEffect, useState } from 'react';
import { NativeModules, StatusBar, Alert } from 'react-native';

export default function useKioskMode(adminPin = '46969', onSuccess) {
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const checkPin = pin => {
    if (pin === adminPin) {
      setPinModalVisible(false);
      const nextState = !isKioskActive;

      if (nextState) {
        NativeModules.Kiosk?.startKioskMode();
      } else {
        NativeModules.Kiosk?.stopKioskMode();
      }

      setIsKioskActive(nextState);

      // Callback sukses
      if (typeof onSuccess === 'function') {
        onSuccess(nextState); // true jika aktif, false jika nonaktif
      }
    } else {
      Alert.alert('PIN Salah', 'Silakan coba lagi.');
    }
  };

  const onLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 1000) {
      setTapCount(prev => {
        if (prev >= 4) {
          setPinModalVisible(true);
          return 0;
        }
        return prev + 1;
      });
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);
  };

  // useEffect(() => {
  //   NativeModules.Kiosk?.startKioskMode();
  //   setIsKioskActive(true);
  // }, []);

  // useEffect(() => {
  //   StatusBar.setHidden(isKioskActive, 'fade');
  // }, [isKioskActive]);

  return {
    isKioskActive,
    pinModalVisible,
    setPinModalVisible,
    checkPin,
    onLogoTap,
  };
}
