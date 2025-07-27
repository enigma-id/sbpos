import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  Button,
  Divider,
  Icon,
  IndexPath,
  List,
  ListItem,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';

import { Container, EmptyScreen, Loading } from '../../../components/screen';

import useSalesChannel from '../../../services/sales/channel/hook';
import useCatalog from '../../../services/catalog/hooks';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { currencyFormat } from '../../../components/utils/common';
import useSession from '../../../services/sales/session/hook';

const CatalogScreen = () => {
  const router = useNavigation();
  const Cart = useSelector(state => state?.Cart);

  const { selectedChannel, salesChannels, loading, selectChannel } =
    useSalesChannel();
  const { summary, summaryResult } = useSession();

  const {
    catalog,
    isLoadingCatalog,
    isRefreshing,
    loadNextPage,
    refreshCatalog,
    categories,
    selectedCategory,
    refetchCategory,
    onSelectCategory,
  } = useCatalog();

  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['40%'], []);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  const [isOpen, setIsOpen] = React.useState(false);

  const openSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChanges = React.useCallback(
    index => {
      const isClosing = index === -1;

      if (!selectedChannel && isClosing) {
        openSheet();
      } else {
        if (!isClosing) {
          setIsOpen(true);
          Animated.timing(overlayOpacity, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setIsOpen(false));
        }
      }
    },
    [selectedChannel],
  );

  const handleSelectChannel = item => {
    selectChannel(item);

    setTimeout(() => {
      closeSheet();
    }, 100);
  };

  React.useEffect(() => {
    if (!selectedChannel && salesChannels.length > 0) {
      selectChannel(salesChannels[0]); // Pilih otomatis yang pertama
    }
  }, [selectedChannel, salesChannels]);

  React.useEffect(() => {
    summary();
  }, []);

  return (
    <Container>
      <View
        style={[
          Styles.flex,
          Styles.alignItemsCenter,
          Styles.bgWhite,
          Styles.py3,
          Styles.px6,
          { borderBottomColor: '#f0f0f0', borderBottomWidth: 2, gap: 10 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Select
            selectedIndex={
              categories?.length > 0 && selectedCategory
                ? new IndexPath(
                    categories.findIndex(
                      cat => cat.id === selectedCategory?.id,
                    ) + 1,
                  )
                : new IndexPath(0)
            }
            value={
              !selectedCategory
                ? 'Semua Kategori'
                : categories.find(c => c?.id === selectedCategory?.id)?.name
            }
            onSelect={index => {
              if (index.row === 0) {
                onSelectCategory(null);
              } else {
                onSelectCategory(categories[index.row - 1]);
              }
            }}
            onFocus={() => {
              refetchCategory();
            }}
          >
            <SelectItem title="Semua Kategori" />
            {categories?.map(item => (
              <SelectItem key={item.id} title={item.name} />
            ))}
          </Select>
        </View>
        <View>
          <TouchableOpacity
            onPress={() =>
              router.navigate('transaction', {
                id: summaryResult?.data?.data?.id,
              })
            }
          >
            <Icon name="list-outline" style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoadingCatalog ? (
        <Loading />
      ) : (
        <List
          data={catalog}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={[
            Styles.px6,
            Styles.py4,
            { justifyContent: 'center' },
          ]}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableNativeFeedback
              key={item?.id}
              background={TouchableNativeFeedback.Ripple('#dbdbdb')}
              onPress={() =>
                router.navigate('cart', {
                  catalog: item,
                })
              }
              useForeground={true}
            >
              <View
                style={[
                  {
                    width: (DEVICE_WIDTH - 13 * (2 * 2)) / 2,
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    overflow: 'hidden',
                  },
                  Styles.bgWhite,
                  Styles.alignItemsCenter,
                  Styles.justifyContentCenter,
                ]}
              >
                {item?.image && (
                  <Image
                    source={{ uri: item?.image }}
                    // source={require('../../../assets/logo.png')}
                    style={{ width: '100%', height: 80, marginBottom: 8 }}
                  />
                )}
                <View style={[Styles.px3, Styles.pb3]}>
                  <Text
                    category="h5"
                    numberOfLines={2}
                    style={[Styles.textCenter]}
                  >
                    {item?.name}
                  </Text>
                  <Text
                    category="label"
                    style={[Styles.textCenter]}
                    status="primary"
                  >
                    {currencyFormat(item?.unit_price || 0)}
                  </Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          onRefresh={refreshCatalog}
          refreshing={isRefreshing}
          numColumns={2}
          ListFooterComponent={
            isLoadingCatalog && catalog?.length > 0 ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={() => <EmptyScreen />}
        />
      )}
      <View
        style={[
          Styles.flex,
          Styles.justifyContentCenter,
          Styles.bgWhite,
          Styles.py3,
          { gap: 10, borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <View style={{ width: DEVICE_WIDTH / 3 }}>
          <Button
            onPress={openSheet}
            size="small"
            appearance="outline"
            status="info"
          >
            <Text numberOfLines={1} style={{ textAlign: 'center' }}>
              {selectedChannel?.name || `Pilih Ch.`}
            </Text>
          </Button>
        </View>
        <View style={{ width: DEVICE_WIDTH / 1.7 }}>
          <Button
            disabled={Cart?.count === 0}
            size="small"
            accessoryRight={props => (
              <Icon {...props} name="arrow-forward-outline" />
            )}
            onPress={() => router.navigate('checkout')}
          >
            Total ({Cart?.count}) = {currencyFormat(Cart?.subtotal)}
          </Button>
        </View>
      </View>

      {/* Overlay */}
      {isOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (selectedChannel) closeSheet();
          }}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'black', opacity: overlayOpacity },
            ]}
          />
        </Pressable>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={!!selectedChannel}
        backgroundStyle={{ borderRadius: 16 }}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <Text style={{ marginBottom: 10 }} category="label">
            Pilih Sales Channel
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <List
              data={salesChannels}
              keyExtractor={item => item.id?.toString()}
              renderItem={({ item }) => (
                <ListItem
                  title={item?.name}
                  onPress={() => handleSelectChannel(item)}
                />
              )}
              ItemSeparatorComponent={Divider}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </Container>
  );
};

export default CatalogScreen;
