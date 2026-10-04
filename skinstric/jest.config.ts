import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// next/jest wires in SWC for ts/tsx and mocks css + next/font — no babel config needed
const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // next/jest doesn't read tsconfig paths — without this every @/ import fails to resolve
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
};

// exported through createJestConfig because it loads next.config async
export default createJestConfig(config);
