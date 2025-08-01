import { createSlice } from '@reduxjs/toolkit';
import { isEqual, sortBy } from 'lodash';

// Helpers
function removingZero(items) {
  return items.filter(item => item.quantity >= 1);
}

function flattenAdditionals(additionals = []) {
  const result = [];

  additionals.forEach(add => {
    const { id: addon_id, type, childs = [] } = add;

    childs.forEach(child => {
      const isSelected =
        type === 'quantity' ? (child.quantity || 0) > 0 : !!child.selected;

      if (isSelected) {
        const entry = { addon_id, catalog_id: child.catalog_id ?? child.id };

        if (child.catalog_id) {
          entry.id = child.id;
        }

        if (type === 'quantity') entry.quantity = child.quantity;
        result.push(entry);
      }
    });
  });

  return sortBy(result, ['addon_id', 'catalog_id']);
}

function extractUniqueCategories(items) {
  const map = new Map();

  items.forEach(item => {
    const cat = item.category ?? item.catalog?.category;

    if (cat?.id != null && !map.has(cat.id)) {
      map.set(cat.id, {
        ...cat,
        discount_type: null,
        discount_value: 0,
      });
    }
  });

  return Array.from(map.values());
}

function mergeCategoryDiscounts(newCats, oldCats) {
  return newCats.map(newCat => {
    const existing = oldCats.find(c => c.id === newCat.id);
    return existing
      ? {
          ...newCat,
          discount_type: existing.discount_type,
          discount_value: existing.discount_value,
        }
      : newCat;
  });
}

function getCategoryDiscount(item, itemCategories) {
  const cat = item.category ?? item.catalog.category;
  const found = itemCategories.find(c => c.id === cat?.id);
  if (!found) return 0;

  const { discount_type, discount_value } = found;
  if (!discount_type || !discount_value) return 0;

  if (discount_type === 'percentage') {
    return Math.floor((item.subtotal * discount_value) / 100);
  }

  if (discount_type === 'nominal') {
    const itemQty = item.quantity || 0;
    return Math.floor(discount_value * itemQty);
  }

  return 0;
}

function calculateCartLevelDiscount(subtotal, type, value) {
  if (!type || !value) return 0;

  if (type === 'percentage') {
    return Math.floor((subtotal * value) / 100);
  }

  if (type === 'nominal') {
    return Math.min(subtotal, value);
  }

  return 0;
}

function recalculateTotals(state) {
  const items = state.items.list || [];

  const itemWithDiscounts = items.map(item => {
    const discount = getCategoryDiscount(item, state.discount.category);
    return {
      ...item,
      discount_amount: discount,
      final_total: Math.max(0, item.subtotal - discount),
    };
  });

  state.items.list = itemWithDiscounts;

  const subtotalAll = itemWithDiscounts.reduce(
    (sum, item) => sum + item.final_total,
    0,
  );

  const cartDiscount = calculateCartLevelDiscount(
    subtotalAll,
    state.discount.cart.type,
    state.discount.cart.value,
  );

  state.meta.subtotal = subtotalAll;
  state.discount.cart.amount = cartDiscount;
  state.meta.grand_total = Math.max(0, subtotalAll - cartDiscount);
}

function updateItemsAndDiscounts(state) {
  state.items.list = removingZero(state.items.list);
  state.items.count = state.items.list.length;

  const newCats = extractUniqueCategories(state.items.list);
  state.discount.category = mergeCategoryDiscounts(
    newCats,
    state.discount.category,
  );

  recalculateTotals(state);
}

// Initial State
const defineInitialState = () => ({
  items: {
    list: [],
    count: 0,
  },
  discount: {
    category: [],
    cart: {
      type: null,
      value: 0,
      amount: 0,
    },
  },
  meta: {
    subtotal: 0,
    grand_total: 0,
  },
});

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: defineInitialState(),
  reducers: {
    resetCart: () => defineInitialState(),

    addItem: (state, action) => {
      const catalog = action.payload;
      const flat = flattenAdditionals(catalog.additionals);
      let existingIndex;

      if (catalog.is_custom) {
        existingIndex = state.items.list.findIndex(
          item =>
            item.is_custom === 1 &&
            item.name?.trim().toLowerCase() ===
              catalog.name?.trim().toLowerCase() &&
            item.unit_price === catalog.unit_price,
        );
      } else {
        existingIndex = state.items.list.findIndex(
          item =>
            item.catalog_id === catalog.id &&
            isEqual(item.additionals_flat, flat),
        );
      }

      if (existingIndex >= 0) {
        state.items.list[existingIndex].quantity += catalog.quantity;
        state.items.list[existingIndex].subtotal += catalog.subtotal;
      } else {
        state.items.list.push({
          ...catalog,
          catalog_id: catalog.id,
          additionals: catalog.additionals,
          additionals_flat: flat,
          quantity: catalog.quantity,
          subtotal: catalog.subtotal,
        });
      }

      updateItemsAndDiscounts(state);
    },

    changeItem: (state, action) => {
      const { key, catalog } = action.payload;

      if (state.items.list[key]) {
        state.items.list[key] = {
          ...state.items.list[key],
          name: catalog.name,
          quantity: catalog.quantity,
          unit_price: catalog.unit_price,
          additionals: catalog.additionals,
          additionals_flat: flattenAdditionals(catalog.additionals),
          subtotal: catalog.subtotal,
        };
      }

      updateItemsAndDiscounts(state);
    },

    removeItem: (state, action) => {
      const index = action.payload;

      if (typeof index === 'number' && state.items.list[index]) {
        state.items.list.splice(index, 1);
      }

      updateItemsAndDiscounts(state);
    },

    updateCategoryDiscount: (state, action) => {
      const { id, discount_type, discount_value } = action.payload;

      const cat = state.discount.category.find(c => c.id === id);
      if (cat) {
        cat.discount_type = discount_type;
        cat.discount_value = discount_value;
      }

      recalculateTotals(state);
    },

    updateCartDiscount: (state, action) => {
      const { discount_type, discount_value } = action.payload;

      state.discount.cart.type = discount_type;
      state.discount.cart.value = discount_value;

      recalculateTotals(state);
    },
  },
});

export const {
  addItem,
  changeItem,
  resetCart,
  removeItem,
  updateCategoryDiscount,
  updateCartDiscount,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
