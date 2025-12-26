import { z } from 'zod';
import { r_log } from '../BaseResponse';

// Strings
const handleNullOrUndefined = (value: unknown): string =>
  typeof value === 'string' ? value : '';

export const stringUUIDMandatory = (fieldName: string) => {
  const schema = z
    .string()
    .trim()
    .uuid({ message: `${fieldName} must be a valid UUID` })
    .nonempty(`${fieldName} is required.`)
    .transform(handleNullOrUndefined);
  return schema;
};

export const stringMandatory = (
  fieldName: string,
  min: number = 1,
  max: number = 1000,
) => {
  const schema = z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters.`)
    .max(max, `${fieldName} must be at most ${max} characters.`)
    .nonempty(`${fieldName} is required.`)
    .transform(handleNullOrUndefined);
  return schema;
};

export const stringOptional = (
  fieldName: string,
  min: number = 0,
  max: number = 1000,
  defaultValue: string = '',
) => {
  const schema = z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters.`)
    .max(max, `${fieldName} must be at most ${max} characters.`)
    .transform(handleNullOrUndefined)
    .default(defaultValue);
  return schema;
};

const handleNullOrUndefinedStringArray = (
  value: unknown,
  defaultValue: string[],
): string[] => (Array.isArray(value) ? value : defaultValue);

export const stringArrayMandatory = (
  fieldName: string,
  min: number = 1,
  max: number = 1000,
  unique: boolean = false,
) => {
  const schema = z
    .array(z.string().trim(), {
      invalid_type_error: `${fieldName} must be an array of strings.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);
  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }
  return schema.transform((val) => handleNullOrUndefinedStringArray(val, []));
};

export const stringArrayOptional = (
  fieldName: string,
  min: number = 0,
  max: number = 1000,
  defaultValue: string[] = [],
  unique: boolean = false,
) => {
  const schema = z
    .array(z.string().trim(), {
      invalid_type_error: `${fieldName} must be an array of strings.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);
  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }
  return schema.optional().default(defaultValue);
};

// Numbers
export const numberMandatory = (
  fieldName: string,
  min: number = 1,
  max: number = 1000000000,
  defaultValue: number = 0,
) => {
  return z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return defaultValue;
      if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
      return val;
    },
    z
      .number({ invalid_type_error: `${fieldName} must be a number.` })
      .min(min, `${fieldName} must be at least ${min}.`)
      .max(max, `${fieldName} must be at most ${max}.`),
  );
};

export const numberOptional = (
  fieldName: string,
  min: number = 0,
  max: number = 1000000000,
  defaultValue: number = 0,
) => {
  return z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val),
    z
      .number({ invalid_type_error: `${fieldName} must be a number.` })
      .min(min, `${fieldName} must be at least ${min}.`)
      .max(max, `${fieldName} must be at most ${max}.`)
      .optional()
      .default(defaultValue),
  );
};

const handleNullOrUndefinedNumberArray = (
  value: unknown,
  defaultValue: number[],
): number[] => (Array.isArray(value) ? value : defaultValue);

export const numberArrayMandatory = (
  fieldName: string,
  min: number = 1,
  max: number = 1000,
  unique: boolean = false,
) => {
  const schema = z
    .array(
      z.number({
        invalid_type_error: `${fieldName} must be an array of numbers.`,
      }),
    )
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);

  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }

  return schema.transform((val) => handleNullOrUndefinedNumberArray(val, []));
};

export const numberArrayOptional = (
  fieldName: string,
  min: number = 0,
  max: number = 1000,
  defaultValue: number[] = [],
  unique: boolean = false,
) => {
  const schema = z
    .array(
      z.number({
        invalid_type_error: `${fieldName} must be an array of numbers.`,
      }),
    )
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);

  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }

  return schema.optional().default(defaultValue);
};

// Double Numbers
export const doubleMandatory = (
  fieldName: string,
  min: number = 0.1,
  max: number = 1000000.0,
  decimalPlaces: number = 2,
  defaultValue: number = 0.0,
) => {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') val = parseFloat(val);
      if (typeof val === 'number')
        return parseFloat(val.toFixed(decimalPlaces));
      return val;
    },
    z
      .number({ invalid_type_error: `${fieldName} must be a number.` })
      .min(min, `${fieldName} must be at least ${min}.`)
      .max(max, `${fieldName} must be at most ${max}.`)
      .default(defaultValue),
  );
};

export const doubleMandatoryLatLng = (
  fieldName: string,
  defaultValue: number = 0.0,
) => {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') val = parseFloat(val);
      if (typeof val === 'number') return parseFloat(val.toFixed(6));
      return val;
    },
    z
      .number({ invalid_type_error: `${fieldName} must be a number.` })
      .min(-180, `${fieldName} must be at least -180.`)
      .max(180, `${fieldName} must be at most 180.`)
      .default(defaultValue),
  );
};

export const doubleMandatoryAmount = (
  fieldName: string,
  defaultValue: number = 0.0,
) => {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') val = parseFloat(val);
      if (typeof val === 'number') return parseFloat(val.toFixed(6));
      return val;
    },
    z
      .number({ invalid_type_error: `${fieldName} must be a number.` })
      .default(defaultValue),
  );
};

export const doubleOptional = (
  fieldName: string,
  min: number = 0.0,
  max: number = 1000000.0,
  decimalPlaces: number = 2,
  defaultValue: number = 0.0,
) => {
  return z
    .preprocess(
      (val) => {
        if (typeof val === 'string') val = parseFloat(val);
        if (typeof val === 'number')
          return parseFloat(val.toFixed(decimalPlaces));
        return val;
      },
      z
        .number({ invalid_type_error: `${fieldName} must be a number.` })
        .min(min, `${fieldName} must be at least ${min}.`)
        .max(max, `${fieldName} must be at most ${max}.`)
        .default(defaultValue),
    )
    .optional();
};

export const doubleOptionalLatLng = (
  fieldName: string,
  defaultValue: number = 0.0,
) => {
  return z
    .preprocess(
      (val) => {
        if (typeof val === 'string') val = parseFloat(val);
        if (typeof val === 'number') return parseFloat(val.toFixed(6));
        return val;
      },
      z
        .number({ invalid_type_error: `${fieldName} must be a number.` })
        .min(-180, `${fieldName} must be at least -180.`)
        .max(180, `${fieldName} must be at most 180.`)
        .default(defaultValue),
    )
    .optional();
};

export const doubleOptionalAmount = (
  fieldName: string,
  defaultValue: number = 0.0,
) => {
  return z
    .preprocess(
      (val) => {
        if (typeof val === 'string') val = parseFloat(val);
        if (typeof val === 'number') return parseFloat(val.toFixed(6));
        return val;
      },
      z
        .number({ invalid_type_error: `${fieldName} must be a number.` })
        .default(defaultValue),
    )
    .optional();
};

// Boolean
const handleNullOrUndefinedBoolean = (
  value: unknown,
  defaultValue: boolean,
): boolean => (typeof value === 'boolean' ? value : defaultValue);

export const booleanMandatory = (
  fieldName: string,
  defaultValue: boolean = false,
) => {
  return z
    .boolean({ invalid_type_error: `${fieldName} must be true or false.` })
    .transform((val) => handleNullOrUndefinedBoolean(val, defaultValue));
};

export const booleanOptional = (
  fieldName: string,
  defaultValue: boolean = false,
) => {
  return z
    .boolean({ invalid_type_error: `${fieldName} must be true or false.` })
    .optional()
    .default(defaultValue);
};

// Enums
export const enumMandatory = <T extends Record<string, string>>(
  fieldName: string,
  enumType: T,
  defaultValue: T[keyof T],
) => {
  return z
    .union([
      z.nativeEnum(enumType, {
        invalid_type_error: `${fieldName} should be one of the following values: ${Object.values(enumType).join(', ')}.`,
      }),
      z
        .string()
        .refine((val) => Object.values(enumType).includes(val as T[keyof T]), {
          message: `${fieldName} should be one of the following values: ${Object.values(enumType).join(', ')}.`,
        }),
    ])
    .default(defaultValue)
    .refine((val) => val !== '', {
      message: `Please select ${fieldName}.`,
    }) as unknown as z.ZodType<T[keyof T]>;
};

export const enumOptional = <T extends Record<string, string>>(
  fieldName: string,
  enumType: T,
  defaultValue: T[keyof T],
) => {
  return z
    .nativeEnum(enumType, {
      invalid_type_error: `${fieldName} must be an array containing only the following values: ${Object.values(enumType).join(', ')}.`,
    })
    .optional()
    .default(() => defaultValue as any);
};

const handleNullOrUndefinedEnumArray = <T>(
  value: unknown,
  defaultValue: T[],
): T[] => (Array.isArray(value) ? value : defaultValue);

export const getAllEnums = <T extends Record<string, string>>(
  enumType: T,
): (keyof T)[] => {
  return Object.values(enumType) as (keyof T)[];
};

export const enumArrayMandatory = <T extends Record<string, string>>(
  fieldName: string,
  enumType: T,
  defaultValue: (keyof T)[] = getAllEnums(enumType),
  min: number = 1,
  max: number = 1000,
  unique: boolean = false,
) => {
  const schema = z
    .array(z.nativeEnum(enumType), {
      invalid_type_error: `${fieldName} must be an array containing only the following values: ${Object.values(enumType).join(', ')}.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);
  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }
  schema.transform((val) => handleNullOrUndefinedEnumArray(val, []));
  return schema.default(() => defaultValue as T[keyof T][]);
};

export const enumArrayOptional = <T extends Record<string, string>>(
  fieldName: string,
  enumType: T,
  defaultValue: (keyof T)[] = getAllEnums(enumType),
  min: number = 0,
  max: number = 1000,
  unique: boolean = false,
) => {
  const schema = z
    .array(z.nativeEnum(enumType), {
      invalid_type_error: `${fieldName} must be an array containing only the following values: ${Object.values(enumType).join(', ')}.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`)
    .max(max, `${fieldName} must contain at most ${max} items.`);

  if (unique) {
    schema.refine(
      (arr) => new Set(arr).size === arr.length,
      `${fieldName} must contain unique values.`,
    );
  }
  return schema.optional().default(() => defaultValue as T[keyof T][]);
};

// Date
const handleNullOrUndefinedDate = (
  value: unknown,
  defaultValue: string,
): string => {
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return value;
  }
  return defaultValue;
};

export const dateMandatory = (
  fieldName: string,
  minDate?: string,
  maxDate?: string,
  defaultValue: string = new Date().toISOString(),
) => {
  const schema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid ISO date.`,
    })
    .transform((val) => handleNullOrUndefinedDate(val, defaultValue));

  if (minDate) {
    schema.refine((val) => new Date(val) >= new Date(minDate), {
      message: `${fieldName} must be after ${minDate}.`,
    });
  }

  if (maxDate) {
    schema.refine((val) => new Date(val) <= new Date(maxDate), {
      message: `${fieldName} must be before ${maxDate}.`,
    });
  }

  return schema;
};

export const dateOptional = (
  fieldName: string,
  minDate?: string,
  maxDate?: string,
  defaultValue: string = new Date().toISOString(),
) => {
  const schema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid ISO date.`,
    })
    .optional()
    .default(defaultValue);

  if (minDate) {
    schema.refine((val) => new Date(val) >= new Date(minDate), {
      message: `${fieldName} must be after ${minDate}.`,
    });
  }

  if (maxDate) {
    schema.refine((val) => new Date(val) <= new Date(maxDate), {
      message: `${fieldName} must be before ${maxDate}.`,
    });
  }

  return schema;
};

export const dateTimeMandatory = (
  fieldName: string,
  minDate?: string,
  maxDate?: string,
  defaultValue: string = new Date().toISOString(),
) => {
  const schema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid ISO date.`,
    })
    .transform((val) => handleNullOrUndefinedDate(val, defaultValue));

  if (minDate) {
    schema.refine((val) => new Date(val) >= new Date(minDate), {
      message: `${fieldName} must be after ${minDate}.`,
    });
  }

  if (maxDate) {
    schema.refine((val) => new Date(val) <= new Date(maxDate), {
      message: `${fieldName} must be before ${maxDate}.`,
    });
  }

  return schema;
};

export const dateTimeOptional = (
  fieldName: string,
  minDate?: string,
  maxDate?: string,
  defaultValue: string = new Date().toISOString(),
) => {
  const schema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid ISO date.`,
    })
    .optional()
    .default(defaultValue);

  if (minDate) {
    schema.refine((val) => new Date(val) >= new Date(minDate), {
      message: `${fieldName} must be after ${minDate}.`,
    });
  }

  if (maxDate) {
    schema.refine((val) => new Date(val) <= new Date(maxDate), {
      message: `${fieldName} must be before ${maxDate}.`,
    });
  }

  return schema;
};

// Nested Object
export const nestedObjectMandatory = <T extends z.ZodRawShape>(
  fieldName: string,
  schema: z.ZodObject<T>,
  defaultValue: z.infer<typeof schema>,
) => {
  return schema.default(() => defaultValue as any);
};

export const nestedObjectOptional = <T extends z.ZodRawShape>(
  fieldName: string,
  schema: z.ZodObject<T>,
  defaultValue: z.infer<typeof schema>,
) => {
  return schema.optional().default(() => defaultValue as any);
};

export const dynamicJsonSchema = (
  fieldName: string,
  defaultValue: Record<string, any> = {},
) =>
  z
    .record(z.any())
    .optional()
    .default(() => defaultValue);

// Nested Array of Objects
export const nestedArrayOfObjectMandatory = <T extends z.ZodRawShape>(
  fieldName: string,
  schema: z.ZodObject<T>,
  defaultValue: z.infer<typeof schema>[] = [],
  min: number = 1,
  max?: number,
) => {
  let arraySchema = z
    .array(schema, {
      invalid_type_error: `${fieldName} must be an array of objects.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`);

  if (max !== undefined) {
    arraySchema = arraySchema.max(
      max,
      `${fieldName} must contain at most ${max} items.`,
    );
  }

  return arraySchema.default(() => defaultValue);
};

export const nestedArrayOfObjectsOptional = <T extends z.ZodRawShape>(
  fieldName: string,
  schema: z.ZodObject<T>,
  defaultValue: z.infer<typeof schema>[] = [],
  min: number = 0,
  max?: number,
) => {
  let arraySchema = z
    .array(schema, {
      invalid_type_error: `${fieldName} must be an array of objects.`,
    })
    .min(min, `${fieldName} must contain at least ${min} items.`);

  if (max !== undefined) {
    arraySchema = arraySchema.max(
      max,
      `${fieldName} must contain at most ${max} items.`,
    );
  }

  return arraySchema.optional().default(() => defaultValue);
};

// Exclusive for dropdowns always my id is string(uuid)
export const single_select_mandatory = (fieldName: string) => {
  const schema = z
    .string()
    .trim()
    .nonempty(`Please select ${fieldName}.`)
    .transform(handleNullOrUndefined);
  return schema;
};

export const single_select_optional = (fieldName: string) => {
  r_log(fieldName);
  const schema = z.string().trim().transform(handleNullOrUndefined);
  return schema;
};

export const multi_select_mandatory = (
  fieldName: string,
  min: number = 1,
  max: number = 1000,
  defaultValue: string[] = [],
) => {
  const schema = z
    .array(
      z.string({
        invalid_type_error: `${fieldName} must be an array of strings.`,
      }),
    )
    .min(
      min,
      `Please select at least ${min} ${fieldName}${min > 1 ? 's' : ''}.`,
    )
    .max(
      max,
      `Please select at most ${max} ${fieldName}${max > 1 ? 's' : ''}.`,
    );
  return schema.optional().default(defaultValue);
};

export const multi_select_optional = (
  fieldName: string,
  max: number = 1000,
  defaultValue: string[] = [],
) => {
  const schema = z
    .array(
      z.string({
        invalid_type_error: `${fieldName} must be an array of strings.`,
      }),
    )
    .max(
      max,
      `Please select at most ${max} ${fieldName}${max > 1 ? 's' : ''}.`,
    );
  return schema.optional().default(defaultValue);
};
