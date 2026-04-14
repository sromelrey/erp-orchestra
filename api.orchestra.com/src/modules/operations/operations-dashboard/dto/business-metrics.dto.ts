import { ApiProperty } from '@nestjs/swagger';

export class MonthlyDataPointDto {
  @ApiProperty({ description: 'Month in YYYY-MM format' })
  month: string;

  @ApiProperty({ description: 'Amount for the month' })
  amount: number;
}

export class TopCustomerDto {
  @ApiProperty({ description: 'Customer name' })
  name: string;

  @ApiProperty({ description: 'Total revenue from this customer' })
  amount: number;
}

export class InventoryStatusDto {
  @ApiProperty({ description: 'Total value of all inventory' })
  value: number;

  @ApiProperty({
    description: 'Inventory turnover ratio (12-mo expense ÷ avg stock value)',
  })
  turnover: number;

  @ApiProperty({ description: 'Number of items with low stock' })
  lowStockCount: number;
}

export class BusinessMetricsDto {
  @ApiProperty({ description: 'All-time total revenue' })
  totalRevenue: number;

  @ApiProperty({ description: 'Revenue for current month' })
  thisMonthRevenue: number;

  @ApiProperty({ description: 'All-time total expenses (purchase spend)' })
  totalExpense: number;

  @ApiProperty({ description: 'Expenses for current month' })
  thisMonthExpense: number;

  @ApiProperty({ description: 'All-time gross profit (revenue - expense)' })
  grossProfit: number;

  @ApiProperty({ description: 'Gross margin percentage' })
  grossMargin: number;

  @ApiProperty({
    description: 'Monthly sales data for last 12 months',
    type: [MonthlyDataPointDto],
  })
  monthlySales: MonthlyDataPointDto[];

  @ApiProperty({
    description: 'Monthly expense data for last 12 months',
    type: [MonthlyDataPointDto],
  })
  monthlyExpenses: MonthlyDataPointDto[];

  @ApiProperty({
    description: 'Monthly gross profit data for last 12 months',
    type: [MonthlyDataPointDto],
  })
  monthlyGrossProfit: MonthlyDataPointDto[];

  @ApiProperty({
    description: 'Top 5 customers by revenue',
    type: [TopCustomerDto],
  })
  topCustomers: TopCustomerDto[];

  @ApiProperty({
    description: 'Inventory status metrics',
    type: InventoryStatusDto,
  })
  inventoryStatus: InventoryStatusDto;
}
