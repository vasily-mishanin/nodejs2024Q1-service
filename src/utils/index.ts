export function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export const isBoolean = (val: any) => typeof val === 'boolean';

export const isValidReferenceId = (id: string | null) =>
  isValidUUID(id) || id === null ? true : false;
