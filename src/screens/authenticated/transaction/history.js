import { View } from 'react-native';
import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Divider, Icon, List, ListItem, Text } from '@ui-kitten/components';

import { Container, EmptyScreen, Loading } from '../../../components/screen';
import { currencyFormat, dateFormat } from '../../../components/utils/common';
import { Styles } from '../../../components/theme/styles';
import useSession from '../../../services/sales/session/hook';

const HistoryScreen = ({ route }) => {
  const router = useNavigation();
  const { show, showResult } = useSession();

  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState([]);

  const fetchOrders = async () => {
    await show({ id: route?.params?.id });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  React.useEffect(() => {
    if (showResult.isSuccess) {
      setData(showResult?.data?.data?.sales_orders || []);
      setRefreshing(false);
    }
  }, [showResult]);

  if (showResult.isLoading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem
        onPress={() => router.navigate('transaction/detail', { id: item?.id })}
        style={[Styles.px6]}
        title={() => <Text category="h5">{item?.code}</Text>}
        description={() => (
          <Text category="s2">{dateFormat(item?.ordered_at)}</Text>
        )}
        accessoryLeft={() => (
          <Icon
            name={item?.payment_method?.name ? 'card-outline' : 'cash-outline'}
            style={{ width: 25, height: 25, marginEnd: 10 }}
          />
        )}
        accessoryRight={() => (
          <View>
            <Text category="h5" style={[Styles.textEnd]}>
              {currencyFormat(item?.total_bill)}
            </Text>
            <Text category="s2" style={[Styles.textEnd]}>
              {item?.payment_method?.name || 'CASH'}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <List
          data={data}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={() => <EmptyScreen />}
        />
      </View>
    </Container>
  );
};

export default HistoryScreen;
