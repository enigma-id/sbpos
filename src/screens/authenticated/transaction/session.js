import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Divider,
  Icon,
  List,
  ListItem,
  Spinner,
  Text,
} from '@ui-kitten/components';

import useSession from '../../../services/sales/session/hook';

import { Container, Loading } from '../../../components/screen';
import { currencyFormat, dateFormat } from '../../../components/utils/common';
import { Styles } from '../../../components/theme/styles';

const SessionScreen = () => {
  const router = useNavigation();
  const { session, sessionResult } = useSession();

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchSession = async (pageParam = 1, isRefresh = false) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await session({ page: pageParam, limit: 15 });
      const newData = res?.data || [];
      const totalItems = res?.total || 0;
      setTotal(totalItems);
      setPage(pageParam);

      if (isRefresh || pageParam === 1) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }
    } catch (err) {
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (data.length < total && !loading) {
      fetchSession(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSession(1, true);
  };

  React.useEffect(() => {
    fetchSession(); // load pertama
  }, []);

  if (sessionResult.isLoading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem
        onPress={() => router.navigate('transaction', { id: item?.id })}
        style={[Styles.px6]}
        accessoryLeft={() => (
          <Icon
            name="document-outline"
            style={{ width: 25, height: 25, marginEnd: 10 }}
          />
        )}
        title={() => <Text category="h5">{item?.cashier?.name}</Text>}
        description={() => (
          <Text category="s2">{dateFormat(item?.started_at)}</Text>
        )}
        accessoryRight={() => (
          <View>
            {item?.status === 'active' ? (
              <View
                style={[
                  Styles.bgSuccess,
                  Styles.px2,
                  Styles.py2,
                  Styles.rounded4,
                ]}
              >
                <Text category="h6" status="control" style={[Styles.textEnd]}>
                  AKTIF
                </Text>
              </View>
            ) : (
              <Text category="h5" style={[Styles.textEnd]}>
                {currencyFormat(item?.cash_finished)}
              </Text>
            )}
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            loading && !refreshing ? (
              <View
                style={[
                  Styles.alignContentCenter,
                  Styles.alignItemsCenter,
                  Styles.py5,
                ]}
              >
                <Spinner status="primary" />
              </View>
            ) : null
          }
        />
      </View>
    </Container>
  );
};

export default SessionScreen;
