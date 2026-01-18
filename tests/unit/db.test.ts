import { describe, it, expect } from 'vitest';
import dbConnect from '@/lib/db';

const runDbTests = process.env.RUN_DB_TESTS === 'true';

describe.skipIf(!runDbTests)('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    const connection = await dbConnect();
    expect(connection).toBeDefined();
    expect(connection.connection.readyState).toBeGreaterThan(0);
  });

  it('should reuse existing connection', async () => {
    const connection1 = await dbConnect();
    const connection2 = await dbConnect();
    expect(connection1).toBe(connection2);
  });
});
