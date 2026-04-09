import { useState } from 'react';
import { useGetLocationsQuery } from '@/store/api';
import { FormFieldOption } from '@/components/entity-manager/types';

export function useSalesOrderForm() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  // Query locations for the selected warehouse
  const { data: warehouseLocations = [], isLoading: isLoadingLocations } = useGetLocationsQuery(
    { warehouseId: selectedWarehouseId || '', limit: 1000 },
    { skip: !selectedWarehouseId, refetchOnMountOrArgChange: true }
  );

  // Function to fetch locations by warehouse ID
  const getLocationsByWarehouse = async (warehouseId: string | number): Promise<FormFieldOption[]> => {
    const warehouseIdStr = String(warehouseId);
    
    // Set the warehouse ID to trigger the RTK Query
    setSelectedWarehouseId(warehouseIdStr);
    
    // Wait for the query to complete
    if (isLoadingLocations) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getLocationsByWarehouse(warehouseId);
    }
    
    // Return the locations
    return warehouseLocations.map((loc: { id: string; name: string }) => ({
      value: loc.id,
      label: loc.name
    }));
  };

  return {
    selectedWarehouseId,
    getLocationsByWarehouse,
  };
}
