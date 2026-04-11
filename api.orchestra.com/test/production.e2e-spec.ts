import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductionModule } from '../src/modules/operations/production/production.module';
import { ProductionBatch, ProductionStatus } from '../src/entities';

describe('Production API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ProductionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    // Login to get auth token
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      })
      .expect(200);

    authToken = response.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Production Batches', () => {
    let createdBatchId: number;

    it('POST /v1/ops/production-batches - should create a new production batch', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/ops/production-batches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bomId: 1,
          plannedQuantity: 100,
          startDate: '2024-01-15T09:00:00Z',
          endDate: '2024-01-20T17:00:00Z',
          notes: 'Test production batch',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.batchNo).toMatch(/^PB-\d{4}-\d{4}$/);
      expect(response.body.data.status).toBe(ProductionStatus.PLANNED);
      createdBatchId = response.body.data.id;
    });

    it('GET /v1/ops/production-batches - should list all production batches', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/ops/production-batches')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('batches');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.batches)).toBe(true);
    });

    it('GET /v1/ops/production-batches/:id - should get a specific production batch', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/ops/production-batches/${createdBatchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(createdBatchId);
      expect(response.body.data).toHaveProperty('bom');
      expect(response.body.data).toHaveProperty('consumptions');
    });

    it('PATCH /v1/ops/production-batches/:id - should update a PLANNED batch', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/v1/ops/production-batches/${createdBatchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plannedQuantity: 150,
          notes: 'Updated quantity',
        })
        .expect(200);

      expect(response.body.data.plannedQuantity).toBe(150);
    });

    it('POST /v1/ops/production-batches/:id/start - should start a production batch', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/ops/production-batches/${createdBatchId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.status).toBe(ProductionStatus.IN_PROGRESS);
      expect(response.body.data.startDate).toBeTruthy();
    });

    it('POST /v1/ops/production-batches/:id/complete - should complete a production batch', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/ops/production-batches/${createdBatchId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          actualQuantity: 145,
        })
        .expect(200);

      expect(response.body.data.status).toBe(ProductionStatus.COMPLETED);
      expect(response.body.data.actualQuantity).toBe(145);
      expect(response.body.data.endDate).toBeTruthy();
    });

    it('POST /v1/ops/production-batches - should create another batch for cancellation test', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/ops/production-batches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bomId: 1,
          plannedQuantity: 50,
        })
        .expect(201);

      const newBatchId = response.body.data.id;

      // Cancel the batch
      await request(app.getHttpServer())
        .post(`/v1/ops/production-batches/${newBatchId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reason: 'Test cancellation',
        })
        .expect(200);

      // Verify it's cancelled
      const cancelledResponse = await request(app.getHttpServer())
        .get(`/v1/ops/production-batches/${newBatchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cancelledResponse.body.data.status).toBe(
        ProductionStatus.CANCELLED,
      );
    });

    it('DELETE /v1/ops/production-batches/:id - should delete a PLANNED batch', async () => {
      // Create a new batch to delete
      const response = await request(app.getHttpServer())
        .post('/v1/ops/production-batches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bomId: 1,
          plannedQuantity: 25,
        })
        .expect(201);

      const batchToDeleteId = response.body.data.id;

      // Delete it
      await request(app.getHttpServer())
        .delete(`/v1/ops/production-batches/${batchToDeleteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('GET /v1/ops/production-batches?status=PLANNED - should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/ops/production-batches?status=PLANNED')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(
        response.body.data.batches.every(
          (batch: ProductionBatch) => batch.status === ProductionStatus.PLANNED,
        ),
      ).toBe(true);
    });
  });
});
