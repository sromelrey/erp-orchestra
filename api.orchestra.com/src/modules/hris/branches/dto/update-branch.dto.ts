import { PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './create-branch.dto';

/**
 * DTO for updating an existing branch.
 * All fields are optional.
 */
export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
