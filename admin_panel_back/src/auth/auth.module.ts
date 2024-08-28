import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/config/jwt-config';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    JwtStrategy,
    EmailService,
  ],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
})
export class AuthModule {}
