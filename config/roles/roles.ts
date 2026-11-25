export interface RoleCredentials {
  username: string;
  password: string;
}

function toEnvPrefix(role: string): string {
  return role
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_');
}

/** True when both <ROLE>_USERNAME and <ROLE>_PASSWORD are filled in the active .env file. */
export function hasRoleCredentials(role: string): boolean {
  const prefix = toEnvPrefix(role);
  return Boolean(process.env[`${prefix}_USERNAME`]?.trim() && process.env[`${prefix}_PASSWORD`]);
}

/**
 * Reads credentials for a role from <ROLE>_USERNAME and <ROLE>_PASSWORD in the active .env file.
 * Application roles are not confirmed yet, so none are predefined.
 */
export function getRoleCredentials(role: string): RoleCredentials {
  const prefix = toEnvPrefix(role);
  const username = process.env[`${prefix}_USERNAME`]?.trim();
  const password = process.env[`${prefix}_PASSWORD`];
  if (!username || !password) {
    throw new Error(`Credentials for role "${role}" are not configured (${prefix}_USERNAME / ${prefix}_PASSWORD).`);
  }
  return { username, password };
}
