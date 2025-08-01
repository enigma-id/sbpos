import React from 'react';
import { View, Platform, UIManager, Animated, Easing } from 'react-native';
import { Styles } from '../theme/styles';
import { Icon, ListItem, Text } from '@ui-kitten/components';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({ title, children, expanded, onToggle }) => {
  const rotateAnim = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={[Styles.mb4]}>
      <ListItem
        onPress={onToggle}
        style={[Styles.px6, Styles.py4, Styles.mt5]}
        title={() => (
          <Text
            category="s2"
            style={[
              Styles.textUppercase,
              Styles.textGrey,
              { letterSpacing: 1, fontWeight: 'bold' },
            ]}
          >
            {title}
          </Text>
        )}
        accessoryRight={() => (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              name="chevron-forward-outline"
              style={{ width: 20, height: 20 }}
            />
          </Animated.View>
        )}
      />
      {expanded && <View style={[Styles.p4, Styles.bgWhite]}>{children}</View>}
    </View>
  );
};

export default Accordion;
