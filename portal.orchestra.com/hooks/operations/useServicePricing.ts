import { useGetServicePriceQuery } from '@/store/api';

export function useServicePricing(
  serviceTypeId: number | undefined,
  serviceOptionId: number | undefined,
) {
  const { data, isLoading } = useGetServicePriceQuery(
    { serviceTypeId: serviceTypeId!, serviceOptionId: serviceOptionId! },
    { skip: !serviceTypeId || !serviceOptionId },
  );

  return {
    price: data?.price || null,
    serviceTypeName: data?.serviceTypeName || '',
    serviceOptionName: data?.serviceOptionName || '',
    isLoading,
  };
}
