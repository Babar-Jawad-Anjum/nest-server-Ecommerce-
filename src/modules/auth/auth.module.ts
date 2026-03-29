import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStragegy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'defaultSecret2026',
        signOptions: {
          expiresIn: Number(configService.get<number>('JWT_EXPIRES_IN', 900)),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStragegy],
  controllers: [AuthController],
})
export class AuthModule {}
