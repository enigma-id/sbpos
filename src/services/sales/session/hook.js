import { useDispatch } from 'react-redux';
import {
  useEndMutation,
  useLazySessionQuery,
  useLazyShowSessionQuery,
  useStartMutation,
  useLazySummaryQuery,
} from './action';

import { $failure } from '../../form/action';
import { checkSession, invalidateSession } from './slice';
import { resetCart } from '../../cart/slice';
import { clearSelectedChannel } from '../channel/slice';
import { useNavigation } from '@react-navigation/native';

const useSession = () => {
  const dispatch = useDispatch();
  const router = useNavigation();

  const [startMutation, startResult] = useStartMutation();
  const [endMutation, endResult] = useEndMutation();
  const [triggerSummary, summaryResult] = useLazySummaryQuery();
  const [triggerSession, sessionResult] = useLazySessionQuery();
  const [triggerShow, showResult] = useLazyShowSessionQuery();

  const start = async data => {
    try {
      const res = await startMutation(data).unwrap();

      if (res?.status === 'success') {
        dispatch(resetCart());
        dispatch(clearSelectedChannel());
        summary();

        router.reset({
          index: 1,
          routes: [{ name: 'home' }, { name: 'catalog' }],
        });
      }
    } catch (error) {
      dispatch($failure(error));
    }
  };

  const end = async data => {
    try {
      await endMutation(data).unwrap();
    } catch (error) {
      dispatch($failure(error));
    }
  };

  const summary = async () => {
    try {
      await triggerSummary().unwrap();
      dispatch(checkSession());
    } catch (error) {
      dispatch(invalidateSession());
    }
  };

  const session = async params => {
    try {
      const res = await triggerSession(params).unwrap();
      return res;
    } catch (error) {}
  };

  const show = async ({ id }) => {
    try {
      await triggerShow({ id }).unwrap();
    } catch (error) {}
  };

  return {
    start,
    startResult,
    end,
    endResult,
    summary,
    summaryResult,
    session,
    sessionResult,
    show,
    showResult,
  };
};

export default useSession;
