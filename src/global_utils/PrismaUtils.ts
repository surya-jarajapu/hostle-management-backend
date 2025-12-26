import { LoadParents, LoadChild, LoadChildCount } from './EnumsBase';
import { OrderByType } from './zod/zod_base_schema';

export const buildIn = (field: string, values?: any[]) =>
  Array.isArray(values) && values.length > 0 ? { [field]: { in: values } } : {};

export const buildInParent = (
  relation: string,
  field: string,
  values: any[],
) =>
  values.length > 0
    ? {
        [relation]: {
          is: { [field]: { in: values } },
        },
      }
    : {};

export const search = (
  fields: string[],
  search?: string,
  modeInsensitive: boolean = true,
): object => {
  if (!search || typeof search !== 'string' || search.trim() === '') {
    return {};
  }

  const trimmedSearch = search.trim();

  return {
    OR: fields.map((field) => {
      const fieldParts = field.split('.');
      const result: any = {};
      let currentObj = result;
      let parentObj: any = null;
      let parentKey: string = '';

      for (let i = 0; i < fieldParts.length; i++) {
        const key = fieldParts[i];

        if (i === fieldParts.length - 1) {
          currentObj[key] = {
            contains: trimmedSearch,
            mode: modeInsensitive ? 'insensitive' : undefined,
          };
        } else if (key === 'some') {
          parentObj[parentKey] = { some: {} };
          currentObj = parentObj[parentKey].some;
        } else {
          currentObj[key] = {};
          parentObj = currentObj;
          parentKey = key;
          currentObj = currentObj[key];
        }
      }

      return result;
    }),
  };
};

export const addPrefix = (
  prefix: string,
  fields: string[],
  type: 'parent' | 'child' = 'parent',
): string[] => {
  if (type === 'parent') {
    return fields.map((field) => `${prefix}.${field}`);
  } else {
    return fields.map((field) => `${prefix}.some.${field}`);
  }
};

export const buildInclude = (
  dto: any,
  parents: string[],
  children: string[],
  where?: Record<string, any>,
  includeData?: Record<string, any>,
): any => {
  const final_where_relations = deepMerge(where, dto.where_relations);
  const final_include_details = deepMerge(includeData, dto.include_details);

  const include: any = {};

  const addFields = (list?: string[]) =>
    list?.forEach((key) => {
      const hasWhere = final_where_relations?.[key];
      const hasInclude = final_include_details?.[key];
      if (hasWhere || hasInclude) {
        include[key] = {};
        if (hasWhere) include[key].where = hasWhere;
        if (hasInclude) include[key].include = hasInclude;
      } else {
        include[key] = true;
      }
    });

  //Parents
  if (dto.load_parents === LoadParents.Yes) {
    addFields(parents);
  } else if (dto.load_parents === LoadParents.Custom) {
    addFields(dto.load_parents_list);
  }

  //Childs
  if (dto.load_child === LoadChild.Yes) {
    addFields(children);
  } else if (dto.load_child === LoadChild.Custom) {
    addFields(dto.load_child_list);
  }

  //Child Cound
  if (dto.load_child_count === LoadChildCount.Yes) {
    if (children && children.length > 0) {
      include._count = {
        select: Object.fromEntries(children.map((c) => [c, true])),
      };
    }
  } else if (dto.load_child_count === LoadChildCount.Custom) {
    if (dto.load_child_count_list && dto.load_child_count_list.length > 0) {
      include._count = {
        select: Object.fromEntries(
          dto.load_child_count_list.map((c) => [c, true]),
        ),
      };
    }
  }

  return include;
};

export const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  if (!target) return source;

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export type SortOrderType = 'asc' | 'desc';

export const buildOrderBy = (orderByItems: OrderByType): any[] => {
  if (!orderByItems || orderByItems.length === 0) {
    return [{ added_date_time: 'asc' as SortOrderType }];
  }

  return orderByItems.map((item) => {
    const fieldParts = item.field.split('.');
    const orderByObj: any = {};
    let currentObj: any = orderByObj;

    for (let i = 0; i < fieldParts.length - 1; i++) {
      currentObj[fieldParts[i]] = {};
      currentObj = currentObj[fieldParts[i]];
    }

    currentObj[fieldParts[fieldParts.length - 1]] =
      item.direction.toLowerCase() === ('asc' as SortOrderType)
        ? ('asc' as SortOrderType)
        : ('desc' as SortOrderType);

    return orderByObj;
  });
};

export const filterFields = (
  obj: Record<string, any>,
  fields: string[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  // Preprocess field paths into a tree
  const tree: Record<string, string[]> = {};
  for (const field of fields) {
    const [head, ...tail] = field.split('.');
    if (!tree[head]) tree[head] = [];
    if (tail.length > 0) tree[head].push(tail.join('.'));
  }

  for (const key in tree) {
    if (!(key in obj)) continue;

    const val = obj[key];
    const nestedFields = tree[key];

    // Case: Direct field (primitive)
    if (nestedFields.length === 0) {
      result[key] = val;
    }

    // Case: Object
    else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      result[key] = filterFields(val, nestedFields);
    }

    // Case: Array of objects
    else if (Array.isArray(val)) {
      result[key] = val.map((item) =>
        typeof item === 'object' && item !== null
          ? filterFields(item, nestedFields)
          : item,
      );
    }
  }

  return result;
};
