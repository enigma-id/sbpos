import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { resetCart } from './slice';
import { useCheckoutMutation, useLazyGetMethodQuery } from './action';
import { $failure } from '../form/action';
import { useLazyGetCatalogDetailQuery } from '../catalog/action';
import { clearSelectedChannel } from '../sales/channel/slice';

const useCart = catalog_id => {
  const dispatch = useDispatch();
  const router = useNavigation();
  const state = router.getState();

  const SalesChannel = useSelector(state => state.SalesChannel);

  const [triggerDetail, detailResult] = useLazyGetCatalogDetailQuery();
  const [triggerMethod, methodResult] = useLazyGetMethodQuery();
  // const { data: method, isLoading, error } = useGetMethodQuery();
  const [checkoutMutation, checkoutResult] = useCheckoutMutation();

  // Get all items in cart
  const cartItems = useSelector(state => state?.Cart.items);

  // Check if item is already in cart
  const existingIndex = cartItems.findIndex(item => item?.id === catalog_id);
  const isItemInCart = existingIndex >= 0;
  const existingItem = isItemInCart ? cartItems[existingIndex] : null;

  const reset = () => {
    dispatch(resetCart());
    const routes = state?.routes?.slice(0, -1);
    router.dispatch(
      CommonActions.reset({
        index: routes.length - 1,
        routes,
      }),
    );
  };

  const isCheckoutRunning = useRef(false);

  const checkout = async data => {
    if (isCheckoutRunning.current) {
      console.log('⛔ Prevented double checkout');
      return;
    }

    console.log('⚡ Attempting checkout at', new Date().toISOString());
    isCheckoutRunning.current = true;

    try {
      const res = await checkoutMutation(data).unwrap();

      // if (res?.status === 'success') {
      //   dispatch(resetCart());
      //   dispatch(clearSelectedChannel());

      //   router.navigate('confirmation', { order: res?.data });
      // }
    } catch (error) {
      dispatch($failure(error));
    } finally {
      isCheckoutRunning.current = false;
    }
  };

  const method = async () => {
    try {
      await triggerMethod().unwrap();
    } catch (error) {}
  };

  // Only trigger once on mount
  useEffect(() => {
    if (catalog_id) {
      triggerDetail({
        id: catalog_id,
        channel_id: SalesChannel?.selectedChannel?.id,
      });
    }
  }, [catalog_id]);

  return {
    catalogDetail: detailResult?.data?.data,
    isLoading: detailResult.isFetching,
    error: detailResult.error,
    isItemInCart,
    existingItem,
    existingIndex,
    // paymentMethod: method?.data,
    method,
    methodResult,
    checkout,
    checkoutResult,
    reset,
  };
};

export default useCart;
