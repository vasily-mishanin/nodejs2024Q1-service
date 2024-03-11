export function isValidUUID(id: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
}

export const isBoolean = (val: any) => typeof val === 'boolean';

export const isValidReferenceId = (id: string | null) =>
  isValidUUID(id) || id === null ? true : false;

export function thinObjectOut(obj: Record<string, any>, keys: string[]) {
  const leftEntries = Object.entries(obj).filter(
    (entry) => !keys.includes(entry[0]),
  );
  return Object.fromEntries(leftEntries);
}
