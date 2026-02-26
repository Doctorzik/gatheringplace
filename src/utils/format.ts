import type { ZodError } from 'zod';

export const formatValidationErrors = (errors: ZodError): string => {
  if (!errors || !errors.issues) return 'Validation failed';
  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(', ');
  return JSON.stringify(errors);
};
