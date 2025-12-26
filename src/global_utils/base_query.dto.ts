import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LoadChild, LoadParents, PAGING } from './EnumsBase';
import { Status } from 'prisma/generated';

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  search = '';

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Status, { each: true })
  @IsArray()
  @Type(() => String)
  status: Status[] = [Status.Active, Status.Inactive];

  @IsOptional()
  @IsEnum(PAGING)
  paging: PAGING = PAGING.No;

  //@Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsOptional()
  @IsNumber()
  page_count = 10;

  //@Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsOptional()
  @IsNumber()
  page_index = 0;

  @IsOptional()
  @IsEnum(LoadChild)
  load_child: LoadChild = LoadChild.No;

  @IsOptional()
  @IsEnum(LoadParents)
  load_parents: LoadParents = LoadParents.No;
}
