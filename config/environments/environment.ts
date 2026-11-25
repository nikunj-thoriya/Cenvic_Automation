import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

export const SUPPORTED_ENVIRONMENTS = ['dev', 'demo'] as const;

export const DEFAULT_ENVIRONMENT: EnvironmentName = 'dev';

export type EnvironmentName = (typeof SUPPORTED_ENVIRONMENTS)[number];

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseUrl: string;
  loginPath: string;
  apiBaseUrl: string;
  headless: boolean;
  retries: number;
  workers: number;
  testTimeout: number;
  expectTimeout: number;
  actionTimeout: number;
  navigationTimeout: number;
}

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function isSupportedEnvironment(value: string): value is EnvironmentName {
  return (SUPPORTED_ENVIRONMENTS as readonly string[]).includes(value);
}

function readRequired(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Required variable "${key}" is missing or empty in .env.${process.env.TEST_ENV}.`);
  }
  return value;
}

function readInteger(key: string): number {
  const value = Number(readRequired(key));
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Variable "${key}" must be a non-negative whole number.`);
  }
  return value;
}

function readBoolean(key: string): boolean {
  const value = readRequired(key).toLowerCase();
  if (value !== 'true' && value !== 'false') {
    throw new Error(`Variable "${key}" must be "true" or "false".`);
  }
  return value === 'true';
}

function readUrl(key: string): string {
  const value = readRequired(key);
  if (!URL.canParse(value)) {
    throw new Error(`Variable "${key}" must be a valid URL.`);
  }
  return value;
}

function readPath(key: string): string {
  const value = readRequired(key);
  if (!value.startsWith('/')) {
    throw new Error(`Variable "${key}" must start with "/".`);
  }
  return value;
}

/** Loads and validates the environment selected by TEST_ENV (defaults to dev when unset). */
export function loadEnvironment(): EnvironmentConfig {
  const name = process.env.TEST_ENV?.trim().toLowerCase() || DEFAULT_ENVIRONMENT;
  if (!isSupportedEnvironment(name)) {
    throw new Error(`TEST_ENV must be one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}. Received "${name}".`);
  }

  const envFile = path.join(PROJECT_ROOT, `.env.${name}`);
  if (!fs.existsSync(envFile)) {
    throw new Error(`Environment file ".env.${name}" was not found in the project root.`);
  }
  dotenv.config({ path: envFile, override: true, quiet: true });

  return {
    name,
    baseUrl: readUrl('BASE_URL'),
    loginPath: readPath('LOGIN_PATH'),
    apiBaseUrl: readUrl('API_BASE_URL'),
    headless: readBoolean('HEADLESS'),
    retries: readInteger('RETRIES'),
    workers: readInteger('WORKERS'),
    testTimeout: readInteger('TEST_TIMEOUT'),
    expectTimeout: readInteger('EXPECT_TIMEOUT'),
    actionTimeout: readInteger('ACTION_TIMEOUT'),
    navigationTimeout: readInteger('NAVIGATION_TIMEOUT'),
  };
}
