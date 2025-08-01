import { View } from 'react-native';
import React from 'react';
import { Accordion } from '../../../components/screen';
import { useSelector } from 'react-redux';
import { Input, Text, Button, ButtonGroup } from '@ui-kitten/components';
import useCart from '../../../services/cart/hook';
import { Styles } from '../../../components/theme/styles';
import _ from 'lodash';

const DiscountSection = () => {
  const Cart = useSelector(state => state.Cart);
  const { onChangeDiscount, onChangeCartDiscount } = useCart();

  const [discountInputs, setDiscountInputs] = React.useState({});
  const [discountType, setDiscountType] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const [accordion1Open, setAccordion1Open] = React.useState(false);

  React.useEffect(() => {
    const categoryList = Cart?.discount?.category ?? [];

    const inputs = {};
    const types = {};

    for (const cat of categoryList) {
      inputs[cat.id] = cat.discount_value?.toString?.() ?? '';
      types[cat.id] = cat.discount_type ?? null;
    }

    const cartDiscount = Cart?.discount?.cart ?? {};
    inputs['cart'] = cartDiscount?.value?.toString?.() ?? '';
    types['cart'] = cartDiscount?.type ?? null;

    setCategories(categoryList);
    setDiscountInputs(inputs);
    setDiscountType(types);
  }, []);

  return (
    <View>
      <Accordion
        title="Diskon Kategori"
        expanded={accordionOpen}
        onToggle={() => setAccordionOpen(prev => !prev)}
      >
        {categories.map(category => (
          <View
            key={category.id}
            style={[
              Styles.flex,
              Styles.alignItemsCenter,
              Styles.justifyContentBetween,
              Styles.py2,
              Styles.px6,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text category="s1">{category?.name}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Input
                  value={discountInputs[category.id] ?? ''}
                  keyboardType="number-pad"
                  disabled={!discountType[category.id]}
                  onChangeText={val => {
                    const cleanVal = val.replace(/^0+/, '') || '';
                    setDiscountInputs(prev => ({
                      ...prev,
                      [category.id]: cleanVal,
                    }));
                    onChangeDiscount(category.id, 'discount_value', cleanVal);
                  }}
                  size="small"
                  textStyle={{ textAlign: 'center', fontSize: 16 }}
                />
              </View>

              <ButtonGroup size="tiny" appearance="outline" status="primary">
                {[
                  { label: '%', value: 'percentage' },
                  { label: 'Rp', value: 'nominal' },
                ].map(type => {
                  const isActive = discountType[category.id] === type.value;

                  return (
                    <Button
                      key={type}
                      size="tiny"
                      style={{
                        backgroundColor: isActive ? '#8c8ef850' : 'transparent',
                      }}
                      onPress={() => {
                        setDiscountInputs(prev => ({
                          ...prev,
                          [category.id]: '0',
                        }));
                        setDiscountType(prev => ({
                          ...prev,
                          [category.id]: type.value,
                        }));
                        onChangeDiscount(
                          category.id,
                          'discount_type',
                          type.value,
                        );
                      }}
                    >
                      {type.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </View>
          </View>
        ))}
      </Accordion>

      <Accordion
        title="Diskon All"
        expanded={accordion1Open}
        onToggle={() => setAccordion1Open(prev => !prev)}
      >
        <View
          style={[
            Styles.flex,
            Styles.alignItemsCenter,
            Styles.justifyContentBetween,
            Styles.py2,
            Styles.px6,
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text category="s1">All Items</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Input
                value={discountInputs['cart'] ?? ''}
                keyboardType="number-pad"
                disabled={!discountType['cart']}
                onChangeText={val => {
                  const cleanVal = val.replace(/^0+/, '') || '';
                  setDiscountInputs(prev => ({
                    ...prev,
                    cart: cleanVal,
                  }));
                  onChangeCartDiscount('discount_value', cleanVal);
                }}
                size="small"
                textStyle={{ textAlign: 'center', fontSize: 16 }}
              />
            </View>

            <ButtonGroup size="tiny" appearance="outline" status="primary">
              {[
                { label: '%', value: 'percentage' },
                { label: 'Rp', value: 'nominal' },
              ].map(type => {
                const isActive = discountType['cart'] === type.value;

                return (
                  <Button
                    key={type}
                    size="tiny"
                    style={{
                      backgroundColor: isActive ? '#8c8ef850' : 'transparent',
                    }}
                    onPress={() => {
                      setDiscountInputs(prev => ({
                        ...prev,
                        cart: '0',
                      }));
                      setDiscountType(prev => ({
                        ...prev,
                        cart: type.value,
                      }));
                      onChangeCartDiscount('discount_type', type.value);
                    }}
                  >
                    {type.label}
                  </Button>
                );
              })}
            </ButtonGroup>
          </View>
        </View>
      </Accordion>
    </View>
  );
};

export default React.memo(DiscountSection);
