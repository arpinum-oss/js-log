export function assertOptionalString(
  value: unknown,
  name: string,
): asserts value is string | undefined {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }
}

export function assertOptionalFunction(
  value: unknown,
  name: string,
): asserts value is ((...args: unknown[]) => unknown) | undefined {
  if (value !== undefined && typeof value !== "function") {
    throw new Error(`${name} must be a function`);
  }
}
