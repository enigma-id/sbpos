import {useDispatch, useSelector} from 'react-redux';
import {useGetSalesChannelsQuery} from './action';
import {clearSelectedChannel, setSelectedChannel} from './slice';
import {resetCart} from '../../cart/slice';

const useSalesChannel = () => {
  const dispatch = useDispatch();
  const selectedChannel = useSelector(
    state => state.SalesChannel?.selectedChannel,
  );
  const {
    data: salesChannels = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSalesChannelsQuery();

  const selectChannel = channel => {
    dispatch(setSelectedChannel(channel));
    dispatch(resetCart());
  };

  const resetChannel = () => dispatch(clearSelectedChannel());

  return {
    selectedChannel,
    salesChannels,
    loading: isLoading || isFetching,
    error,
    selectChannel,
    resetChannel,
    refetch,
  };
};

export default useSalesChannel;
