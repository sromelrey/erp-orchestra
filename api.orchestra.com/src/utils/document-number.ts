import { QueryRunner } from 'typeorm';

interface QueryResult {
  last_number?: string | null;
}

export async function generateDocumentNumber(
  prefix: string,
  tableName: string,
  queryRunner: QueryRunner,
  columnName: string = 'adjustment_number',
): Promise<string> {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  let lastNumber: string | null = null;
  try {
    const result = (await queryRunner.query(
      `SELECT MAX(${columnName}) as last_number 
      FROM operations.${tableName}
      WHERE ${columnName} LIKE '${prefix}${currentYear}${currentMonth}%'`,
    )) as QueryResult[];
    // Type guard to safely extract the result
    if (
      Array.isArray(result) &&
      result.length > 0 &&
      result[0] &&
      typeof result[0] === 'object' &&
      'last_number' in result[0]
    ) {
      const queryResult = result[0];
      lastNumber = queryResult.last_number ?? null;
    }
  } catch {
    // If query fails, continue with null lastNumber
    lastNumber = null;
  }

  let sequence = 1;
  if (lastNumber) {
    const lastSequence = parseInt(lastNumber.slice(-4));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `${prefix}${currentYear}${currentMonth}${sequenceStr}`;
}
