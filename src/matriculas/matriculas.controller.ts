// src/matriculas/matriculas.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  /**
   * POST /matriculas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearMatricula(@Body() createMatriculaDto: CreateMatriculaDto) {
    return await this.matriculasService.matricular(createMatriculaDto);
  }

  /**
   * GET /matriculas
   */
  @Get()
  async obtenerTodas() {
    return await this.matriculasService.findAll();
  }
}