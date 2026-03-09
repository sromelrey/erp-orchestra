import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Status } from '@/types/enums';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John', description: 'First name of the employee' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the employee' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: 'EMP-001',
    description: 'Unique employee code',
  })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiPropertyOptional({
    example: 'john.doe@company.com',
    description: 'Employee email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Employee phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '2023-01-15', description: 'Date of hire' })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @ApiPropertyOptional({
    example: 'Jane Doe +1987654321',
    description: 'Emergency contact details',
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: 1, description: 'Department ID' })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Designation ID' })
  @IsOptional()
  @IsNumber()
  designationId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Branch ID' })
  @IsOptional()
  @IsNumber()
  branchId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Manager ID (another employee)',
  })
  @IsOptional()
  @IsNumber()
  managerId?: number;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.ACTIVE,
    description: 'Employee status',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    example: true,
    description:
      'Whether to create a corresponding system user account for the employee',
  })
  @IsOptional()
  @IsBoolean()
  createUserAccount?: boolean;
}
