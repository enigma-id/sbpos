import React from 'react';
import {ActivityIndicator} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {useSelector} from 'react-redux';

import UnauthorizedRouter from './screens/unauthenticated/router';
import {AuthorizedRouter} from './screens/authenticated/router';

const AppNavigator = () => {
  const AppState = useSelector(state => state.App);
  const AuthState = useSelector(state => state.Auth);
  const navigationRef = useNavigationContainerRef();
  const [ready, setReady] = React.useState(false);

  const onStateChanged = () => {
    if (!ready) {
      setReady(navigationRef?.isReady());
    }
  };

  React.useEffect(() => {
    setReady(navigationRef?.isReady());
  }, [navigationRef]);

  if (!AppState?.ready) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={onStateChanged}
      onReady={() => {
        if (!ready) {
          setReady(navigationRef?.isReady());
        }
      }}
      fallback={<ActivityIndicator />}>
      {AuthState?.isAuthenticated ? (
        <AuthorizedRouter />
      ) : (
        <UnauthorizedRouter />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
