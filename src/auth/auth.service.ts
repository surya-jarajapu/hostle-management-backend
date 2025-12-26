import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaPostgrePBService,
    private jwt: JwtService,
  ) {}

  async register(dto: any) {
    try {
      // 🔹 Basic validations
      if (!dto.email) {
        throw new BadRequestException('Email is required');
      }

      if (!dto.password) {
        throw new BadRequestException('Password is required');
      }

      if (!dto.hostel_name) {
        throw new BadRequestException('Hostel name is required');
      }

      // 1️⃣ Find or create hostel
      let hostel = await this.prisma.hostel.findUnique({
        where: { name: dto.hostel_name },
      });

      if (!hostel) {
        hostel = await this.prisma.hostel.create({
          data: {
            name: dto.hostel_name,
            address: dto.address ?? null,
          },
        });
      }

      // 2️⃣ Create master admin
      return await this.prisma.masterUser.create({
        data: {
          name: dto.name,
          email: dto.email,
          mobile: dto.mobile,
          password: dto.password,
          role: 'ADMIN',
          hostel_id: hostel.hostel_id,
        },
      });
    } catch (error: any) {
      // 🔥 UNIQUE CONSTRAINT HANDLING
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
          throw new BadRequestException(
            'Email already registered. Please login or use a different email.',
          );
        }
      }

      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(dto: any) {
    const masterUser = await this.prisma.masterUser.findUnique({
      where: {
        email: dto.email, // ✅ NOW VALID
      },
      include: {
        hostel: {
          select: { hostel_id: true, name: true },
        },
      },
    });

    if (!masterUser)
      throw new UnauthorizedException('Invalid email or password');

    if (dto.password !== masterUser.password)
      throw new UnauthorizedException('Invalid email or password');

    // ✅ hostel_id ALWAYS comes from DB
const token = this.jwt.sign(
  {
    master_user_id: masterUser.master_user_id,
    role: masterUser.role,
    hostel_id: masterUser.hostel_id,
  },
  {
    secret: process.env.JWT_SECRET || 'SECRET123',
  },
);

    
    const { password, ...safe } = masterUser;
    return {
      status: true,
      message: 'Login successful',
      data: {
        token,
        masterUser: safe,
      },
    };
  }

  async validate(payload: any) {
    console.log('JWT PAYLOAD:', payload);
    return {
      master_user_id: payload.master_user_id,
      role: payload.role,
      hostel_id: payload.hostel_id, // 🔥 AVAILABLE AS req.user.hostel_id
    };
  }
}
