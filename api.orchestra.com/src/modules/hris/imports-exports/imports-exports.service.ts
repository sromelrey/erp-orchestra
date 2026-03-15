import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportJob, ExportJob } from '@/entities';
import { JobStatus } from '@/types';
import { CreateImportDto } from './dto/create-import.dto';
import { CreateExportDto } from './dto/create-export.dto';

interface ActorContext {
  id: number;
  tenantId: number;
}

@Injectable()
export class ImportsExportsService {
  constructor(
    @InjectRepository(ImportJob)
    private readonly importJobRepo: Repository<ImportJob>,
    @InjectRepository(ExportJob)
    private readonly exportJobRepo: Repository<ExportJob>,
  ) {}

  async requestImport(dto: CreateImportDto, actor: ActorContext) {
    const job = this.importJobRepo.create({
      tenantId: actor.tenantId,
      requestedBy: actor.id,
      fileKey: dto.fileKey,
      dataset: dto.dataset,
      clientRequestId: dto.clientRequestId,
      status: JobStatus.PENDING,
      progress: 0,
    });
    return this.importJobRepo.save(job);
  }

  async requestExport(dto: CreateExportDto, actor: ActorContext) {
    const job = this.exportJobRepo.create({
      tenantId: actor.tenantId,
      requestedBy: actor.id,
      dataset: dto.dataset,
      clientRequestId: dto.clientRequestId,
      fileKey: dto.fileKey,
      status: JobStatus.PENDING,
      progress: 0,
    });
    return this.exportJobRepo.save(job);
  }

  async findImportJob(id: number, tenantId: number) {
    const job = await this.importJobRepo.findOne({
      where: { id, tenantId },
    });
    if (!job) {
      throw new NotFoundException('Import job not found');
    }
    return job;
  }

  async findExportJob(id: number, tenantId: number) {
    const job = await this.exportJobRepo.findOne({
      where: { id, tenantId },
    });
    if (!job) {
      throw new NotFoundException('Export job not found');
    }
    return job;
  }
}
