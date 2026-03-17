import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BomItem } from '@/entities';

@Injectable()
export class BomItemRepository {
  constructor(
    @InjectRepository(BomItem)
    private readonly repository: Repository<BomItem>,
  ) {}

  create(entity: Partial<BomItem>): BomItem {
    return this.repository.create(entity);
  }

  async save(entity: BomItem): Promise<BomItem> {
    return this.repository.save(entity);
  }

  async find(
    options: {
      where?: Partial<BomItem>;
      relations?: string[];
      withDeleted?: boolean;
    } = {},
  ): Promise<BomItem[]> {
    const queryBuilder = this.repository.createQueryBuilder('bomItem');

    if (options.where) {
      Object.entries(options.where).forEach(
        ([key, value]: [string, unknown]) => {
          if (value !== undefined) {
            queryBuilder.andWhere(`bomItem.${key} = :${key}`, { [key]: value });
          }
        },
      );
    }

    if (options.relations) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`bomItem.${relation}`, relation);
      });
    }

    if (options.withDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder.getMany();
  }

  async update(id: number, update: Partial<BomItem>): Promise<void> {
    await this.repository.update(id, update);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  getRepository(): Repository<BomItem> {
    return this.repository;
  }
}
