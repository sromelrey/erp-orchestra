# Backend Naming Standards

Follow these conventions for all backend development using NestJS and TypeORM.

## File and Directory Naming

- **Folders**: Use `kebab-case`. Examples: `bill-of-materials`, `user-profile`.
- **Files**: Use `kebab-case` with a descriptive suffix. Examples: `user.controller.ts`, `auth.service.ts`, `user.entity.ts`.

## Code Naming

- **Classes**: Use `PascalCase`. Examples: `MaterialMasterController`, `UserService`.
- **Interfaces**: Use `PascalCase` (optionally prefixed with `I`). Examples: `IUser`, `CreateUserDto`.
- **Functions/Methods**: Use `camelCase`. Examples: `findAll()`, `createMaterial()`.
- **Variables/Constants**: Use `camelCase` for variables and `UPPER_SNAKE_CASE` for global/static constants.

## Database Naming (TypeORM)

- **Table Names**: Use `plural_snake_case`. Examples: `users`, `material_masters`.
- **Column Names**: Use `snake_case`. Examples: `first_name`, `created_at`.
- **Schema**: Use descriptive names for groups of tables. Examples: `system`, `hris`, `operations`.

## Import Standards

- **No Nested Imports**: Avoid relative imports like `'../../../'`
- **Use Absolute Imports**: Prefer absolute imports with path mapping (e.g., `@/services/user.service`)
- **Shallow Relatives Only**: Use `./` or `../` for same-level or adjacent directories
- **Index Files**: Use barrel exports for related modules

_See [import-standards.md](./import-standards.md) for detailed guidelines and examples._
