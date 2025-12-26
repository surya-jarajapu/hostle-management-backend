import { SetMetadata } from '@nestjs/common';
import { MasterRole } from 'prisma/generated';

export const Roles = (...roles: MasterRole[]) => SetMetadata('roles', roles);
