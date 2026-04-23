import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Addon } from '@/entities/addons/addon.entity';
import {
  AddonInclusionRule,
  RuleType,
} from '@/entities/addons/addon-inclusion-rule.entity';
import { CalculateAddonPriceDto } from '../dto/addon-selection.dto';

export interface AddonPricingResult {
  addonId: number;
  code: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  isFree: boolean;
  discountAmount: number;
  appliedRule?: {
    ruleType: string;
    thresholdValue: number;
    discountPercent: number;
  };
}

export interface CalculatePriceResponse {
  items: AddonPricingResult[];
  subtotal: number;
  totalDiscount: number;
  total: number;
}

@Injectable()
export class AddonPricingService {
  constructor(
    @InjectRepository(Addon)
    private readonly addonRepository: Repository<Addon>,
    @InjectRepository(AddonInclusionRule)
    private readonly ruleRepository: Repository<AddonInclusionRule>,
  ) {}

  async calculatePrice(
    calculateDto: CalculateAddonPriceDto,
    actor: { tenantId: number; userId: number },
  ): Promise<CalculatePriceResponse> {
    const results: AddonPricingResult[] = [];
    let subtotal = 0;
    let totalDiscount = 0;

    // Get all add-ons with their active rules
    const addonIds = calculateDto.addons.map((a) => a.addonId);
    const addons = await this.addonRepository.find({
      where: {
        id: In(addonIds),
        tenantId: actor.tenantId,
        isActive: true,
      },
      relations: ['inclusionRules'],
    });

    // Get active rules for these add-ons
    const rules = await this.ruleRepository.find({
      where: {
        addonId: In(addonIds),
        tenantId: actor.tenantId,
        isActive: true,
      },
    });

    // Group rules by addonId for easier lookup
    const rulesByAddon = rules.reduce(
      (acc, rule) => {
        if (!acc[rule.addonId]) {
          acc[rule.addonId] = [];
        }
        acc[rule.addonId].push(rule);
        return acc;
      },
      {} as Record<number, AddonInclusionRule[]>,
    );

    // Calculate pricing for each add-on
    for (const selection of calculateDto.addons) {
      const addon = addons.find((a) => a.id === selection.addonId);
      if (!addon) {
        continue; // Skip if add-on not found or inactive
      }

      const quantity = selection.quantity || 1;
      const unitPrice = addon.basePrice;
      let isFree = false;
      let discountAmount = 0;
      let appliedRule:
        | { ruleType: string; thresholdValue: number; discountPercent: number }
        | undefined = undefined;

      // Check inclusion rules
      const addonRules = rulesByAddon[addon.id] || [];
      for (const rule of addonRules) {
        if (
          rule.ruleType === RuleType.MIN_QTY &&
          calculateDto.quantity >= rule.thresholdValue
        ) {
          // Apply the rule with the highest discount
          if (
            rule.discountPercent >
            (discountAmount / (unitPrice * quantity)) * 100
          ) {
            discountAmount =
              unitPrice * quantity * (rule.discountPercent / 100);
            isFree = rule.discountPercent === 100;
            appliedRule = {
              ruleType: rule.ruleType,
              thresholdValue: rule.thresholdValue,
              discountPercent: rule.discountPercent,
            };
          }
        }
      }

      const totalPrice = unitPrice * quantity - discountAmount;

      results.push({
        addonId: addon.id,
        code: addon.code,
        name: addon.name,
        unitPrice,
        quantity,
        totalPrice,
        isFree,
        discountAmount,
        appliedRule,
      });

      subtotal += unitPrice * quantity;
      totalDiscount += discountAmount;
    }

    return {
      items: results,
      subtotal,
      totalDiscount,
      total: subtotal - totalDiscount,
    };
  }

  async getAddonWithRules(
    addonId: number,
    actor: { tenantId: number; userId: number },
  ) {
    const addon = await this.addonRepository.findOne({
      where: {
        id: addonId,
        tenantId: actor.tenantId,
        isActive: true,
      },
      relations: ['inclusionRules'],
    });

    if (!addon) {
      throw new Error(`Addon with ID ${addonId} not found`);
    }

    // Filter only active rules
    addon.inclusionRules =
      addon.inclusionRules?.filter((rule) => rule.isActive) || [];

    return addon;
  }

  async checkInclusionEligibility(
    addonId: number,
    quantity: number,
    actor: { tenantId: number; userId: number },
  ) {
    const rules = await this.ruleRepository.find({
      where: {
        addonId,
        tenantId: actor.tenantId,
        isActive: true,
      },
    });

    const applicableRules = rules.filter((rule) => {
      if (rule.ruleType === RuleType.MIN_QTY) {
        return quantity >= rule.thresholdValue;
      }
      return false;
    });

    // Return the rule with the highest discount
    return applicableRules.reduce(
      (best, current) => {
        if (!best || current.discountPercent > best.discountPercent) {
          return current;
        }
        return best;
      },
      null as AddonInclusionRule | null,
    );
  }
}
