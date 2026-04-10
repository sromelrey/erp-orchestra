import { useState, useCallback } from 'react';
import { store } from '@/store';
import { api } from '@/store/api';
import { FormFieldOption } from '@/components/entity-manager/types';
import { Location } from '@/types/operations';

export function useGoodsReceiptForm() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Function to fetch locations by warehouse ID using RTK Query directly
  const getLocationsByWarehouse = useCallback(async (warehouseId: string | number): Promise<FormFieldOption[]> => {
    const warehouseIdStr = String(warehouseId);
    const loadingKey = `warehouse-${warehouseIdStr}`;
    
    // Set loading state
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      // Use the store to dispatch the query with unwrap() to get the data directly
      const data = await store.dispatch(
        api.endpoints.getLocations.initiate({ warehouseId: warehouseIdStr, limit: 1000 })
      ).unwrap();
      
      const locations = data.map((loc: Location) => ({
        value: String(loc.id), // Ensure value is always a string
        label: loc.name,
        // Optionally include code in the label for better identification
        // label: `${loc.name} (${loc.code})`,
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
