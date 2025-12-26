import { z } from 'zod';
import {  Status } from 'prisma/generated';
import {
  PAGING,
  LoadChild,
  LoadParents,
  OrderBy,
  LoadChildCount,
  IncludeFields,
} from 'src/global_utils/EnumsBase';
import {
  dynamicJsonSchema,
  enumArrayOptional,
  enumMandatory,
  enumOptional,
  getAllEnums,
  numberOptional,
  single_select_optional,
  stringArrayOptional,
  stringMandatory,
  stringOptional,
} from './zod_utils';

export const OrderBySchema = z.array(
  z.object({
    field: stringMandatory('Order Field Name', 0, 255),
    direction: enumMandatory('Order Direction', OrderBy, OrderBy.asc),
  }),
);
export type OrderByType = z.infer<typeof OrderBySchema>;

export const BaseQuerySchema = z.object({
  search: stringOptional('Search', 0, 255, ''),
  status: enumArrayOptional('Status', Status, getAllEnums(Status), 0, 10, true),
  paging: enumOptional('Paging', PAGING, PAGING.Yes),
  page_count: numberOptional('Page Count', 0, 10000, 100),
  page_index: numberOptional('Page Index', 0, 10000, 0),
  load_parents: enumOptional('Load Parents', LoadParents, LoadParents.No),
  load_parents_list: stringArrayOptional('Load Parents List'),
  load_child: enumOptional('Load Child', LoadChild, LoadChild.No),
  load_child_list: stringArrayOptional('Load Child List'),
  load_child_count: enumOptional(
    'Load Child',
    LoadChildCount,
    LoadChildCount.No,
  ),
  load_child_count_list: stringArrayOptional('Load Child List'),
  include_details: dynamicJsonSchema('Include Details', {}),
  where_relations: dynamicJsonSchema('Where Relations', {}),
  order_by: OrderBySchema.optional().default([]),
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-Selection -> MasterMainDateFormat
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
  include_fields: enumOptional(
    'Include Fields',
    IncludeFields,
    IncludeFields.All,
  ),
  include_fields_list: stringArrayOptional('Include Fields List'),
});
export type BaseQueryDTO = z.infer<typeof BaseQuerySchema>;

export const MongoBaseQuerySchema = z.object({
  search: stringOptional('Search', 0, 255, ''),
  paging: enumOptional('Paging', PAGING, PAGING.Yes),
  page_count: numberOptional('Page Count', 0, 10000, 100),
  page_index: numberOptional('Page Index', 0, 10000, 0),
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-Selection -> MasterMainDateFormat
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
});
export type MongoBaseQueryDTO = z.infer<typeof MongoBaseQuerySchema>;
