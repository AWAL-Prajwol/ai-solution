import { describe, it, expect } from 'vitest';

describe('Environment Variables', () => {
  it('should have required environment variables', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  it('should have valid MongoDB URI format', () => {
    const mongoUri = process.env.MONGODB_URI as string;
    expect(mongoUri).toMatch(/^mongodb:\/\/.+/);
  });
});
