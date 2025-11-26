import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

interface JwtPayload {
  userId: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, 
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 🚀 CORRECCIÓN: Usamos el operador de aserción '!' para asegurar que el secreto existe.
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  // El método 'validate' se ejecuta si el token es válido
  async validate(payload: JwtPayload) {
    // Aquí puedes buscar el usuario en la BD para validarlo
    // Simulación:
    const user = { userId: payload.userId, username: payload.username, role: 'authenticated' }; 
    
    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }
    
    // La información del usuario se adjunta a req.user
    return user; 
  }
}