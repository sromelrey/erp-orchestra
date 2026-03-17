import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Bom } from '@/entities';

@Injectable()
export class BomRepository {
  constructor(
    @InjectRepository(Bom)
    private readonly repository: Repository<Bom>,
  ) {}

  private applyScopedFilters(
    queryBuilder: SelectQueryBuilder<Bom>,
    where?: Partial<Bom>,
  ): void {
    if (!where) {
      return;
    }

    const entries = Object.entries(where) as [keyof Bom, unknown][];
    for (const [key, value] of entries) {
      if (value === undefined) {
        continue;
      }

      const keyName = String(key);
      queryBuilder.andWhere(`bom.${keyName} = :${keyName}`, {
        [keyName]: value,
      });
    }
  }

  create(tenantId: number, entity: Partial<Bom>): Bom {
    return this.repository.create({
      ...entity,
      tenantId,
    });
  }

  async save(entity: Bom): Promise<Bom> {
    return this.repository.save(entity);
  }

  async findOne(
    tenantId: number,
    options: { where?: Partial<Bom>; withDeleted?: boolean },
  ): Promise<Bom | null> {
    const queryBuilder = this.repository.createQueryBuilder('bom');

    queryBuilder.where('bom.tenantId = :tenantId', { tenantId });

    this.applyScopedFilters(queryBuilder, options.where);

    if (options.withDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder.getOne();
  }

  async find(
    tenantId: number,
    options: {
      where?: Partial<Bom>;
      relations?: string[];
      withDeleted?: boolean;
    } = {},
  ): Promise<Bom[]> {
    const queryBuilder = this.repository.createQueryBuilder('bom');

    queryBuilder.where('bom.tenantId = :tenantId', { tenantId });

    this.applyScopedFilters(queryBuilder, options.where);

    if (options.relations) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`bom.${relation}`, relation);
      });
    }

    if (options.withDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder.getMany();
  }

  async update(
    tenantId: number,
    id: number,
    update: Partial<Bom>,
  ): Promise<void> {
    await this.repository.update({ id, tenantId }, update);
  }

  async delete(tenantId: number, id: number): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  async softDelete(tenantId: number, id: number): Promise<void> {
    await this.repository.softDelete({ id, tenantId });
  }

  getRepository(): Repository<Bom> {
    return this.repository;
  }
}
