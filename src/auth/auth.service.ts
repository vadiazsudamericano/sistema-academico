import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Conexión a universidad_db
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  userId: number;
  username: string;
  role?: string; // Opcional: para manejar permisos
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // Inyectamos la DB principal
    private jwtService: JwtService,
  ) {}

  // Valida que el usuario exista y la contraseña coincida
  async validateUser(username: string, pass: string): Promise<any> {
    // 1. Buscamos el usuario real en la base de datos
    const user = await this.prisma.usuario.findUnique({
      where: { username },
    });

    // 2. Comparamos la contraseña (asumiendo que están hasheadas con bcrypt)
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Genera el token JWT
  async login(user: any) {
    const payload: JwtPayload = { 
      username: user.username, 
      userId: user.id 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }
}