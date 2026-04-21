import { Injectable } from '@nestjs/common';
import { ServiceConfigurationService } from './service-configuration.service';

@Injectable()
export class ServiceConfigService {
  constructor(
    private readonly serviceConfigurationService: ServiceConfigurationService,
  ) {}

  /**
   * Find matching service configuration based on service type, option, and conditions
   */
  async findMatchingConfiguration(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
    conditions?: { key: string; value: string }[],
  ) {
    // Try to find exact match with conditions
    if (conditions && conditions.length > 0) {
      for (const condition of conditions) {
        const config =
          await this.serviceConfigurationService.findMatchingConfiguration(
            tenantId,
            serviceTypeId,
            serviceOptionId,
            condition.key,
            condition.value,
          );
        if (config) {
          return config;
        }
      }
    }

    // Try to find configuration without conditions
    const config =
      await this.serviceConfigurationService.findMatchingConfiguration(
        tenantId,
        serviceTypeId,
        serviceOptionId,
      );

    return config;
  }

  /**
   * Get BOM ID for a specific service configuration
   */
  async getBomForConfiguration(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
    conditions?: { key: string; value: string }[],
  ) {
    const config = await this.findMatchingConfiguration(
      tenantId,
      serviceTypeId,
      serviceOptionId,
      conditions,
    );

    return config?.bomId || null;
  }

  /**
   * Get price for a specific service configuration
   */
  async getPriceForConfiguration(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
    conditions?: { key: string; value: string }[],
  ) {
    const config = await this.findMatchingConfiguration(
      tenantId,
      serviceTypeId,
      serviceOptionId,
      conditions,
    );

    return config?.price || 0;
  }

  /**
   * Get full configuration details including BOM and price
   */
  async getConfigurationDetails(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
    conditions?: { key: string; value: string }[],
  ) {
    const config = await this.findMatchingConfiguration(
      tenantId,
      serviceTypeId,
      serviceOptionId,
      conditions,
    );

    if (!config) {
      return null;
    }

    return {
      id: config.id,
      bomId: config.bomId,
      price: config.price,
      serviceType: config.serviceType,
      serviceOption: config.serviceOption,
      bom: config.bom,
    };
  }
}
