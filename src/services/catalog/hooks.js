import { useCallback, useState, useEffect } from 'react';
import { useLazyGetCatalogPricingQuery, useGetCategoriesQuery } from './action';
import { useSelector } from 'react-redux';

const useCatalog = () => {
  const selectedChannel = useSelector(
    state => state.SalesChannel?.selectedChannel,
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [triggerPricing, pricingResult] = useLazyGetCatalogPricingQuery();
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    refetch: refetchCategory,
  } = useGetCategoriesQuery();

  const fetchCatalog = useCallback(
    async (pageParam = 1, isRefresh = false) => {
      if (!selectedChannel?.id) return;

      if (isRefresh) setRefreshing(true);

      try {
        const result = await triggerPricing({
          channel_id: selectedChannel.id,
          category_id: selectedCategory?.id,
          page: pageParam,
        }).unwrap();

        const newItems = result?.data || [];
        const totalItems = result?.total || 0;

        setTotal(totalItems);
        setPage(pageParam);

        if (isRefresh || pageParam === 1) {
          setItems(newItems);
        } else {
          setItems(prev => [...prev, ...newItems]);
        }
      } catch (err) {
      } finally {
        if (isRefresh) setRefreshing(false);
      }
    },
    [triggerPricing, selectedChannel, selectedCategory],
  );

  const loadNextPage = useCallback(() => {
    if (items.length < total && !pricingResult.isFetching) {
      fetchCatalog(page + 1);
    }
  }, [items.length, total, page, fetchCatalog, pricingResult.isFetching]);

  const refreshCatalog = useCallback(() => {
    fetchCatalog(1, true);
  }, [fetchCatalog]);

  const onSelectCategory = useCallback(
    categoryId => {
      setSelectedCategory(categoryId);
      fetchCatalog(1, true);
    },
    [fetchCatalog],
  );

  useEffect(() => {
    if (selectedChannel?.id) {
      fetchCatalog(1, true);
    }
  }, [selectedChannel, fetchCatalog]);

  return {
    catalog: items,
    isLoadingCatalog: pricingResult.isFetching,
    isRefreshing: refreshing,
    categories: categoryData?.data || [],
    isLoadingCategory,
    selectedCategory,
    refetchCategory,
    onSelectCategory,
    page,
    loadNextPage,
    refreshCatalog,
    total,
  };
};

export default useCatalog;
