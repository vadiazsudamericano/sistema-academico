import { 
    Controller, 
    Post, 
    Body, 
    HttpCode, 
    HttpStatus,
    UnauthorizedException,
    Get, 
    UseGuards, 
    Request // Decorador de NestJS
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express'; // Tipo de Express para tipar 'req'

import { AuthService } from './auth.service';

/**
 * Data Transfer Object (DTO) para el cuerpo de la petición de login.
 * Usa '!' para indicar que las propiedades serán definitivamente asignadas 
 * por NestJS/el cliente (soluciona el error TS2564).
 */
class LoginDto { 
    username!: string; 
    password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- Endpoint: /auth/login ---
  // Válida credenciales, genera y retorna el token JWT.
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 1. Validar credenciales
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // 2. Generar y 3. Retornar el Token
    return this.authService.login(user);
  }
  @UseGuards(AuthGuard('jwt')) 
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user; 
  }
}