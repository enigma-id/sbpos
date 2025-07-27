import React from 'react';
import { Image, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Button, Divider, List, ListItem, Text } from '@ui-kitten/components';

import useCart from '../../../services/cart/hook';
import { addItem, changeItem } from '../../../services/cart/slice';
import { Container, QuantityStepper } from '../../../components/screen';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { currencyFormat } from '../../../components/utils/common';

const CartScreen = props => {
  const route = useNavigation();
  const dispatch = useDispatch();
  const catalog = props?.route?.params?.catalog;

  const {
    catalogDetail,
    isItemInCart,
    existingItem,
    existingIndex,
    cartItems,
  } = useCart(catalog?.id);

  const [catalogData, setCatalogData] = React.useState({});
  const [quantity, setQuantity] = React.useState(0);
  const [additionals, setAdditionals] = React.useState([]);

  React.useEffect(() => {
    const source = existingItem || catalogDetail;
    if (!source) return;

    setCatalogData({
      ...source,
      unit_price: source?.unit_price || catalog?.unit_price || 0,
    });
    setQuantity(existingItem?.quantity || 0);

    const additions =
      source?.additionals?.map(item => ({
        ...item,
        quantity: existingItem
          ? existingItem?.additionals?.find(t => t.id === item.id)?.quantity ||
            0
          : 0,
      })) || [];

    setAdditionals(additions);
  }, [existingItem, catalogDetail]);

  const updateAdditionalQuantity = (index, newQty) => {
    let updated = [...additionals];
    let item = updated[index];

    item.quantity = newQty;
    item.subtotal = newQty * item.unit_price;
    setAdditionals(updated);
  };

  const getSubtotal = (qty, additions = []) => {
    let sub = qty * (catalogData?.unit_price || catalog?.unit_price || 0);

    additions.forEach(i => {
      sub += i.quantity * qty * i.unit_price;
    });

    return sub;
  };

  const addToCart = () => {
    if (!catalogDetail) return;

    const filteredAdditionals = additionals.filter(item => item.quantity > 0);

    const formattedItem = {
      ...catalogData,
      quantity: quantity,
      additionals: additionals,
      subtotal: getSubtotal(quantity, filteredAdditionals),
    };

    // Kalau quantity <= 0 dan item memang sudah ada di cart, artinya mau hapus
    const isDeleting = quantity <= 0 && isItemInCart;

    if (isItemInCart) {
      dispatch(changeItem({ key: existingIndex, catalog: formattedItem }));
    } else {
      dispatch(addItem(formattedItem));
    }

    const remainingItems = isDeleting
      ? cartItems?.length - 1
      : cartItems?.length + (isItemInCart ? 0 : 1);

    // Navigasi
    if (isDeleting && remainingItems <= 0) {
      route.reset({
        index: 1,
        routes: [{ name: 'home' }, { name: 'catalog' }],
      });
    } else {
      route.goBack();
    }
  };

  return (
    <Container>
      <List
        data={additionals}
        ItemSeparatorComponent={Divider}
        renderItem={({ item, index }) => (
          <ListItem
            disabled
            style={[Styles.px6, Styles.py4]}
            key={item?.id}
            title={() => (
              <Text category="h6" style={[Styles.textUppercase]}>
                {item?.name}
              </Text>
            )}
            description={() => (
              <Text category="s2">@ {currencyFormat(item?.unit_price)}</Text>
            )}
            accessoryRight={
              <QuantityStepper
                value={item?.quantity}
                onChange={val => updateAdditionalQuantity(index, val)}
              />
            }
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View>
              <Image
                source={{ uri: catalogData?.image }}
                style={{ width: DEVICE_WIDTH, height: 100 }}
              />

              <ListItem
                disabled
                style={[Styles.px6, Styles.py4]}
                title={() => (
                  <Text category="h4" style={[Styles.textUppercase]}>
                    {catalogData?.name}
                  </Text>
                )}
                accessoryRight={() => (
                  <Text category="h4">
                    {currencyFormat(
                      catalogData?.unit_price || catalog?.unit_price,
                    )}
                  </Text>
                )}
              />
              <Divider />
            </View>

            {additionals?.length > 0 && (
              <View style={[Styles.px6, Styles.py4]}>
                <Text
                  category="s2"
                  style={[
                    Styles.textUppercase,
                    Styles.textGrey,
                    { letterSpacing: 1, fontWeight: 'bold' },
                  ]}
                >
                  Tambah Topping
                </Text>
              </View>
            )}
          </>
        )}
      />
      <View
        style={[
          Styles.flex,
          Styles.justifyContentCenter,
          Styles.px6,
          Styles.py4,
          Styles.bgWhite,
          { gap: 10, borderTopColor: '#f0f0f0', borderTopWidth: 1 },
        ]}
      >
        <View style={{ width: DEVICE_WIDTH / 2 }}>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </View>
        <View style={{ width: DEVICE_WIDTH / 2.5 }}>
          <Button
            onPress={addToCart}
            size="small"
            status={
              quantity > 0 ? 'success' : isItemInCart ? 'danger' : 'primary'
            }
          >
            {quantity > 0
              ? 'Tambahkan'
              : isItemInCart
              ? 'Hapus & Kembali'
              : 'Kembali'}
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default CartScreen;
