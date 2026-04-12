import { useState, useCallback } from 'react';
import { store } from '@/store';
import { api } from '@/store/api';
import { FormFieldOption } from '@/components/entity-manager/types';
import { Location } from '@/types/operations';

export function useGoodsIssuanceForm() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const getLocationsByWarehouse = useCallback(async (warehouseId: string | number): Promise<FormFieldOption[]> => {
    const warehouseIdStr = String(warehouseId);
    const loadingKey = `warehouse-${warehouseIdStr}`;

    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const data = await store.dispatch(
        api.endpoints.getLocations.initiate({ warehouseId: warehouseIdStr, limit: 1000 })
      ).unwrap();

      const locations = data.map((loc: Location) => ({
        value: String(loc.id),
        label: loc.name,
      }));

      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      return [];
    }
  }, []);

  return {
    getLocationsByWarehouse,
    loadingStates,
  };
}
