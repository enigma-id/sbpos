import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Styles } from '../theme/styles';

const Content = ({ children, refreshing, onRefresh }) => {
  //   const ref = React.useRef(null);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh && (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        )
      }
      //   ref={ref}
      style={{ flex: 1 }}
    >
      <View style={Styles.content}>{children}</View>
    </ScrollView>
  );
};

export default Content;
