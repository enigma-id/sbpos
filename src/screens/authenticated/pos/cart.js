import React from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  CheckBox,
  Divider,
  Input,
  ListItem,
  Radio,
  Text,
} from '@ui-kitten/components';

import useCart from '../../../services/cart/hook';
import { Container, QuantityStepper } from '../../../components/screen';
import { DEVICE_WIDTH, Styles } from '../../../components/theme/styles';
import { currencyFormat } from '../../../components/utils/common';
import { useSelector } from 'react-redux';

const CartScreen = ({ route }) => {
  const navigation = useNavigation();
  const FormState = useSelector(state => state?.Form);

  const catalog = route?.params?.catalog;
  const mode = route?.params?.mode ?? 'add';
  const editKey = route?.params?.editKey ?? null;

  const { catalogDetail, cartItems, change, add } = useCart(catalog?.id);

  const [catalogData, setCatalogData] = React.useState({});
  const [quantity, setQuantity] = React.useState(0);
  const [additionals, setAdditionals] = React.useState([]);

  React.useEffect(() => {
    const isEditMode = mode === 'edit';

    const existingItem =
      isEditMode && typeof editKey === 'number' ? catalog : null;

    if (!catalogDetail) return;

    setCatalogData({
      ...catalogDetail,
      name: catalogDetail?.name || catalog?.name || '',
      unit_price: catalogDetail?.unit_price || catalog?.unit_price || 0,
    });

    if (isEditMode && existingItem) {
      const itemQty = existingItem?.quantity || 0;
      setQuantity(itemQty);

      const additions = (catalogDetail?.additionals || []).map(add => {
        const cartAddon = existingItem?.additionals?.find(
          item => item.id === add.id,
        );
        return {
          ...add,
          childs: (add?.childs || []).map(child => {
            const cartChild = cartAddon?.childs?.find(c => c.id === child.id);

            return {
              ...child,
              quantity:
                add?.type === 'quantity'
                  ? cartChild?.quantity || 0
                  : cartChild
                  ? 1
                  : 0,
              selected: add.type !== 'quantity' ? !!cartChild?.selected : false,
            };
          }),
        };
      });

      setAdditionals(additions);
    } else {
      setQuantity(0);
      const clearedAdditionals = (catalogDetail?.additionals || []).map(
        add => ({
          ...add,
          childs: (add?.childs || []).map(child => ({
            ...child,
            quantity: 0,
            selected: false,
          })),
        }),
      );
      setAdditionals(clearedAdditionals);
    }
  }, [catalogDetail, catalog, mode]);

  const addToCart = () => {
    if (!catalogData) return;

    const formattedItem = {
      ...catalogData,
      quantity,
      additionals,
      subtotal: calculateSubtotal(),
    };

    const isRemoving = quantity <= 0;

    if (mode === 'edit') {
      change(editKey, formattedItem);

      const isLastItem = cartItems?.length === 1;

      if (isRemoving && isLastItem) {
        navigation.reset({
          index: 1,
          routes: [{ name: 'home' }, { name: 'catalog' }],
        });
        return;
      }
    } else {
      add(formattedItem);
    }

    navigation.goBack();
  };

  const updateAdditionalQuantity = (addonId, childId, qty) => {
    setAdditionals(prev =>
      prev.map(add =>
        add.id !== addonId
          ? add
          : {
              ...add,
              childs: add.childs.map(c =>
                c.id !== childId ? c : { ...c, quantity: qty },
              ),
            },
      ),
    );
  };

  const selectOption = (addonId, selectedChildId) => {
    setAdditionals(prev =>
      prev.map(add => {
        if (add.id !== addonId) return add;
        const isAlreadySelected = add.childs.some(
          child => child.id === selectedChildId && child.selected,
        );
        return {
          ...add,
          childs: add.childs.map(child => ({
            ...child,
            selected: isAlreadySelected ? false : child.id === selectedChildId,
            quantity: isAlreadySelected
              ? 0
              : child.id === selectedChildId
              ? 1
              : 0,
          })),
        };
      }),
    );
  };

  const toggleCheckbox = (addonId, childId, checked) => {
    setAdditionals(prev =>
      prev.map(add =>
        add.id !== addonId
          ? add
          : {
              ...add,
              childs: add.childs.map(c =>
                c.id !== childId
                  ? c
                  : { ...c, selected: checked, quantity: checked ? 1 : 0 },
              ),
            },
      ),
    );
  };

  const calculateSubtotal = () => {
    let total = quantity * (catalogData?.unit_price || 0);

    additionals.forEach(add => {
      add.childs.forEach(child => {
        if (add.type === 'quantity' && child.quantity > 0) {
          total += quantity * child.quantity * (child.unit_price || 0);
        }
        if (add.type !== 'quantity' && child.selected) {
          total += quantity * (child.unit_price || 0);
        }
      });
    });

    return total;
  };

  const Checkboxs = ({ label, price, checked, onChange }) => {
    return (
      <TouchableOpacity
        onPress={() => onChange(!checked)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 6,
        }}
      >
        <Text category="s2">{label}</Text>

        <View style={[Styles.flex, Styles.alignItemsCenter, { gap: 10 }]}>
          <Text category="s2">
            {price ? `${currencyFormat(price)}` : 'Free'}
          </Text>
          <CheckBox checked={checked} onChange={() => onChange(!checked)} />
        </View>
      </TouchableOpacity>
    );
  };

  const Selects = ({ label, price, checked, onChange }) => {
    return (
      <TouchableOpacity
        onPress={() => onChange(!checked)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 6,
        }}
      >
        <Text category="s2">{label}</Text>

        <View style={[Styles.flex, Styles.alignItemsCenter, { gap: 10 }]}>
          <Text category="s2">
            {price ? `${currencyFormat(price)}` : 'Free'}
          </Text>
          <Radio checked={checked} onChange={() => onChange(!checked)} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View>
        <Image
          source={{ uri: catalogData?.image }}
          style={{ width: DEVICE_WIDTH, height: 100 }}
        />

        {catalogData?.is_custom === 1 ? (
          <View style={[Styles.px6, Styles.py4]}>
            <Input
              size="large"
              value={catalogData?.name || ''}
              style={[Styles.pb4]}
              label={() => (
                <Text
                  category="s2"
                  style={[
                    Styles.textUppercase,
                    Styles.textGrey,
                    Styles.pb4,
                    { letterSpacing: 1, fontWeight: 'bold' },
                  ]}
                >
                  Catalog Name
                </Text>
              )}
              status={FormState?.errors?.note ? 'danger' : 'basic'}
              onChangeText={v => setCatalogData(prev => ({ ...prev, name: v }))}
            />

            <Input
              size="large"
              value={currencyFormat(catalogData?.unit_price)}
              style={[Styles.pb4]}
              label={() => (
                <Text
                  category="s2"
                  style={[
                    Styles.textUppercase,
                    Styles.textGrey,
                    Styles.pb4,
                    { letterSpacing: 1, fontWeight: 'bold' },
                  ]}
                >
                  Catalog Price
                </Text>
              )}
              keyboardType="number-pad"
              status={FormState?.errors?.note ? 'danger' : 'basic'}
              onChangeText={v => {
                const raw = v.replace(/[^0-9]/g, '');
                setCatalogData(prev => ({
                  ...prev,
                  unit_price: Number(raw),
                }));
              }}
            />
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 140} // bisa disesuaikan
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={[Styles.flex, Styles.flexColumn]}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 32, // atau lebih, tergantung ukuran tombol & keyboard
            }}
          >
            {additionals?.map(addon => (
              <View key={addon.id} style={[Styles.px6, Styles.py4]}>
                <Text
                  category="s2"
                  style={[
                    Styles.textUppercase,
                    Styles.textGrey,
                    { letterSpacing: 1, fontWeight: 'bold' },
                  ]}
                >
                  {addon.name}{' '}
                  <Text
                    category="c1"
                    style={[Styles.textLowercase, { letterSpacing: 0 }]}
                  >
                    {addon?.type === 'quantity'
                      ? '(set quantity for each option)'
                      : addon?.type === 'options'
                      ? '(choose one)'
                      : addon?.type === 'checkbox'
                      ? '(choose one or more)'
                      : null}
                  </Text>
                </Text>

                {addon?.childs?.map(child => (
                  <View key={child.id}>
                    {addon.type === 'quantity' ? (
                      <View
                        style={[
                          Styles.flex,
                          Styles.alignItemsCenter,
                          Styles.justifyContentBetween,
                          Styles.py2,
                        ]}
                      >
                        <Text category="s2">{child.name}</Text>
                        <View
                          style={[
                            Styles.flex,
                            Styles.alignItemsCenter,
                            { gap: 10 },
                          ]}
                        >
                          <Text category="s2">
                            {child?.unit_price
                              ? `${currencyFormat(child?.unit_price)}`
                              : 'Free'}
                          </Text>
                          <QuantityStepper
                            small
                            value={child.quantity}
                            onChange={val =>
                              updateAdditionalQuantity(addon.id, child.id, val)
                            }
                          />
                        </View>
                      </View>
                    ) : addon.type === 'options' ? (
                      <Selects
                        label={child?.name}
                        price={child?.unit_price}
                        checked={child?.selected}
                        onChange={() => selectOption(addon.id, child.id)}
                      />
                    ) : addon.type === 'checkbox' ? (
                      <Checkboxs
                        label={child?.name}
                        price={child?.unit_price}
                        checked={child?.selected}
                        onChange={val =>
                          toggleCheckbox(addon.id, child.id, val)
                        }
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View
        style={[
          Styles.flex,
          Styles.justifyContentCenter,
          Styles.px6,
          Styles.py4,
          Styles.bgWhite,
          {
            gap: 10,
            borderTopColor: '#f0f0f0',
            borderTopWidth: 1,
          },
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
              quantity > 0 ? 'success' : mode === 'edit' ? 'danger' : 'primary'
            }
            disabled={
              (catalogData?.is_custom === 1 && !catalogData?.name) ||
              (catalogData?.is_custom === 1 && !catalogData?.unit_price)
                ? true
                : false
            }
          >
            {quantity > 0
              ? 'Tambahkan'
              : mode === 'edit'
              ? 'Hapus & Kembali'
              : 'Kembali'}
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default CartScreen;
