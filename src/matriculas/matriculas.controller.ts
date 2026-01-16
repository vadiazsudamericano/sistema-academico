import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
// Si tienes implementado JWT, descomenta la siguiente línea:
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()

  async matricular(@Body() createMatriculaDto: CreateMatriculaDto) {
    return await this.matriculasService.matricular(createMatriculaDto);
  }

  @Get()
  async findAll() {
    return await this.matriculasService.findAll();
  }
}