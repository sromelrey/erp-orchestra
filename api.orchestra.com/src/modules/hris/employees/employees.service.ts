import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '@/entities/hris/employee.entity';
import { User } from '@/entities/system/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

/**
 * Service responsible for managing employee records.
 * Handles creation, updates, retrieval, and soft-deletion of Employee entities,
 * always scoped to the authenticated user's tenant.
 * Optionally handles automatic user account creation.
 */
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves all employees for a given tenant using cursor-based pagination.
   *
   * @param tenantId - The tenant ID to scope the query
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated list of Employee entities
   */
  async findAll(
    tenantId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Employee>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder
      .where('employee.tenantId = :tenantId', { tenantId })
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.designation', 'designation')
      .leftJoinAndSelect('employee.branch', 'branch');

    if (cursor) {
      queryBuilder.andWhere('employee.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('employee.id', 'ASC').take(limit + 1);

    const items = await queryBuilder.getMany();
    let nextCursor: string | number | null = null;

    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return {
      data: items,
      meta: {
        nextCursor,
      },
    };
  }

  /**
   * Retrieves a single employee by ID, scoped to tenant.
   *
   * @param id - Employee ID
   * @param tenantId - The tenant ID for scoping
   * @returns The Employee entity
   * @throws {NotFoundException} If the employee does not exist for this tenant
   */
  async findOne(id: number, tenantId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id, tenantId },
      relations: ['department', 'designation', 'branch', 'manager', 'user'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  /**
   * Creates a new employee for a tenant.
   * Optionally provisions a SystemUser account if requested.
   *
   * @param dto - Employee creation data
   * @param tenantId - The tenant ID to associate with the employee
   * @returns The created Employee entity
   */
  async create(dto: CreateEmployeeDto, tenantId: number): Promise<Employee> {
    const { createUserAccount, ...employeeData } = dto;

    return this.dataSource.transaction(async (manager) => {
      // Check for employee code uniqueness
      if (employeeData.employeeCode) {
        const existingCode = await manager.findOne(Employee, {
          where: { employeeCode: employeeData.employeeCode, tenantId },
          withDeleted: true,
        });
        if (existingCode) {
          throw new ConflictException('Employee code already exists');
        }
      }

      let userId: number | undefined = undefined;

      if (createUserAccount && employeeData.email) {
        // Check for email uniqueness before creating
        const existingUser = await manager.findOne(User, {
          where: { email: employeeData.email },
          withDeleted: true,
        });
        if (existingUser) {
          throw new ConflictException('Email already exists for user account');
        }

        // Generate a random temporary password or standard default
        const salt = await bcrypt.genSalt();
        const defaultPassword = 'Welcome123!'; // TODO: Use a proper strategy
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        const newUser = manager.create(User, {
          email: employeeData.email,
          passwordHash,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          tenantId,
          isSystemAdmin: false,
          status: employeeData.status,
        });

        const savedUser = await manager.save(newUser);
        userId = savedUser.id;
      }

      const employee = manager.create(Employee, {
        ...employeeData,
        userId,
        tenantId,
      });

      return manager.save(Employee, employee);
    });
  }

  /**
   * Updates an existing employee, scoped to tenant.
   *
   * @param id - Employee ID
   * @param dto - Partial employee data to update
   * @param tenantId - The tenant ID for scoping
   * @returns The updated Employee entity
   * @throws {NotFoundException} If the employee does not exist for this tenant
   */
  async update(
    id: number,
    dto: UpdateEmployeeDto,
    tenantId: number,
  ): Promise<Employee> {
    const employee = await this.findOne(id, tenantId);

    // We omit createUserAccount from the update mapping
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createUserAccount, ...updateData } = dto;
    Object.assign(employee, updateData);

    return this.employeeRepository.save(employee);
  }

  /**
   * Soft-deletes a employee, scoped to tenant.
   *
   * @param id - Employee ID
   * @param tenantId - The tenant ID for scoping
   * @throws {NotFoundException} If the employee does not exist for this tenant
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const employee = await this.findOne(id, tenantId);
    await this.employeeRepository.softRemove(employee);
  }
}
