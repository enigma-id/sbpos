import { useDispatch } from 'react-redux';
import {
  useCancelMutation,
  useLazyOrderQuery,
  useLazyShowQuery,
} from './action';
import { $failure } from '../../form/action';

const useOrder = () => {
  const dispatch = useDispatch();
  const [triggerOrder, orderResult] = useLazyOrderQuery();
  const [triggerShow, showResult] = useLazyShowQuery();
  const [cancelMutation, cancelResult] = useCancelMutation();

  const order = async (params = {}) => {
    try {
      const res = await triggerOrder(params).unwrap();
      return res;
    } catch (error) {}
  };

  const show = async id => {
    try {
      await triggerShow(id).unwrap();
    } catch (error) {}
  };

  const cancel = async ({ id, payload }) => {
    try {
      const result = await cancelMutation({ id, ...payload }).unwrap();
      return result;
    } catch (error) {
      dispatch($failure(error));
      throw error;
    }
  };

  return {
    order,
    orderResult,
    show,
    showResult,
    cancel,
    cancelResult,
  };
};

export default useOrder;
