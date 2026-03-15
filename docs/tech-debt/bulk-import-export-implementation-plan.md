# Bulk Import/Export APIs – Implementation Plan

This plan closes the tech debt for bulk import/export by adding BullMQ workers, presigned file handling, and wiring controllers/services to queues.

## Goals
- Execute import/export jobs asynchronously with BullMQ workers.
- Provide presigned upload/download URLs for files.
- Surface job progress/status and errors via existing endpoints.

## Scope
- Backend only (NestJS). No UI work included here.
- Datasets: employees, timesheets, payslips (adjust as needed).
- Storage: S3-compatible presigned URLs (configure bucket/prefix via env).

## Plan
1) **Queues & Configuration**
   - Add BullMQ queue registration (e.g., `IMPORT_QUEUE`, `EXPORT_QUEUE`) with Redis config from env.
   - Define queue processors for import/export jobs; set concurrency and retries/backoff.
   - Add a dead-letter strategy or failure handler logging.

2) **FilesService (presigned URLs)**
   - Implement a service to generate presigned PUT for uploads (imports) and GET for downloads (exports).
   - Enforce content type/size limits; namespace keys by tenant/dataset/date.
   - Return fileKey + URL to the caller; store fileKey on job records.

3) **Import Worker**
   - Pull job payload, download file via fileKey, parse CSV/XLSX (library choice), validate rows.
   - Upsert domain records per dataset; record per-row errors; update progress in DB.
   - Mark job status COMPLETED or FAILED with error details.

4) **Export Worker**
   - Query dataset rows, generate CSV/XLSX to a temp file/stream.
   - Upload to storage; set `fileKey` and mark status COMPLETED (or FAILED on error).
   - Support incremental progress updates.

5) **Controller/Service Wiring**
   - On create import/export request: enqueue a job (tenantId, dataset, fileKey, requestedBy, clientRequestId).
   - Use FilesService to issue presigned URLs for upload/download as needed.
   - Ensure status endpoints read DB state (no in-memory coupling).

6) **Env & RBAC**
   - Add Redis and storage env vars (host, port, password, bucket, region, TTLs).
   - Confirm permissions: `hris.import.manage`, `hris.export.manage` already seeded; add worker-side guards if needed.

7) **Monitoring & Observability**
   - Log job lifecycle events; consider BullMQ metrics (counts, failures).
   - Optionally expose a health endpoint that checks Redis connectivity.

## Definition of Done
- Import/export jobs process end-to-end via BullMQ workers without manual intervention.
- Presigned URLs are issued and honored for uploads/downloads.
- Job status/progress reflects reality; failures surface meaningful errors.
- Configuration for Redis and storage is documented in env files.
