# Database Migrations

This folder contains all database migrations for the ERP Orchestra application.

## 📁 Migration Files

- `1642857123-AddCommonEntityColumnsFixedV2.ts` - Adds common entity columns (created_by, updated_by, deleted_by, deleted_at) to operations tables

## 🔄 Running Migrations

To run all pending migrations:
```bash
npm run migration:run
```

To run specific migration:
```bash
npm run typeorm -- migration:run -- -d src/config/database-production.config.ts
```

## 📋 Migration Status

- ✅ **Completed**: Migrations that have been successfully run
- 🔄 **Pending**: Migrations waiting to be executed
- ❌ **Failed**: Migrations that encountered errors

## 🗃️ Database Schema

The database schema is managed through TypeORM migrations rather than synchronization, ensuring:
- **Version control** of schema changes
- **Rollback capability** for failed migrations
- **Production safety** with proper transaction handling

## 📝 Notes

- Always backup database before running migrations in production
- Test migrations in staging environment first
- Keep migration files under version control
- Review migration SQL before running in production
