import { PartialType } from '@nestjs/swagger';
import { CreateDesignationDto } from './create-designation.dto';

/**
 * DTO for updating an existing designation.
 * All fields are optional.
 */
export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {}
