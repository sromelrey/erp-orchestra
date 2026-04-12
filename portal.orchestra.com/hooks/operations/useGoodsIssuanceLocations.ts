import { useState, useRef, useEffect } from 'react';
import { useGetLocationsQuery } from '@/store/api';
import { FormFieldOption } from '@/components/entity-manager/types';

export function useGoodsIssuanceLocations() {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const pendingResolvers = useRef<Map<string, (options: FormFieldOption[]) => void>>(new Map());

  // Query locations for the selected warehouse
  const { data: warehouseLocations = [], isLoading: isLoadingLocations } = useGetLocationsQuery(
    { warehouseId: warehouseId || '', limit: 1000 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  );

  // Resolve pending requests when data changes
  useEffect(() => {
    if (warehouseId && !isLoadingLocations) {
      const resolvers = pendingResolvers.current.get(warehouseId);
      if (resolvers) {
        const options = warehouseLocations.map((loc: { id: string | number; name: string }) => ({
          value: String(loc.id),
          label: loc.name
        }));
        resolvers.forEach(resolve => resolve(options));
        pendingResolvers.current.delete(warehouseId);
      }
    }
  }, [warehouseId, warehouseLocations, isLoadingLocations]);

  // Function to fetch locations by warehouse ID
  const getLocationsByWarehouse = async (warehouseId: string | number): Promise<FormFieldOption[]> => {
    const warehouseIdStr = String(warehouseId);
    
    // If we already have the data and it's not loading, return it
    if (warehouseId === warehouseId && !isLoadingLocations && warehouseLocations.length > 0) {
      return warehouseLocations.map((loc: { id: string | number; name: string }) => ({
        value: String(loc.id),
        label: loc.name
      }));
    }
    
    // Set the warehouse ID to trigger the query
    setWarehouseId(warehouseIdStr);
    
    // Return a promise that will resolve when data arrives
    return new Promise<FormFieldOption[]>((resolve) => {
      const existing = pendingResolvers.current.get(warehouseIdStr) || [];
      pendingResolvers.current.set(warehouseIdStr, [...existing, resolve]);
    });
  };

  return {
    getLocationsByWarehouse,
    isLoadingLocations
  };
}
