import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

/**
 * DTO for updating an existing department.
 * All fields are optional.
 */
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
