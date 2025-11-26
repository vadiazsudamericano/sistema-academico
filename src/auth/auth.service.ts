import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// Suponiendo un tipo UserPayload para la información del token
interface JwtPayload {
  userId: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    // Deberías inyectar aquí tu UsersService para validar el usuario
    // private userService: UsersService, 
  ) {}

  // ** 1. Validar Credenciales **
  async validateUser(username: string, pass: string): Promise<any> {
    // Lógica para buscar el usuario en la base de datos (simulación)
    // const user = await this.userService.findOne(username);
    const user = { userId: 1, username: 'admin', password: 'hashed_password' }; // Simulación
    
    // Lógica para comparar la contraseña (usando bcrypt en un caso real)
    // if (user && await bcrypt.compare(pass, user.password)) {
    if (user && pass === '123456') { // Simulación de validación
      const { password, ...result } = user;
      return result; // Retorna el usuario sin la contraseña
    }
    return null;
  }

  // ** 2. Generar Token JWT **
  async login(user: any) {
    const payload: JwtPayload = { username: user.username, userId: user.userId };
    return {
      access_token: this.jwtService.sign(payload), // Genera el token
    };
  }
}