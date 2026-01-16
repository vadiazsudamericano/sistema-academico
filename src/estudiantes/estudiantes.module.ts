import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';
import { PrismaAcademicoService } from 'src/prisma/prisma-academico.service';

@Module({
  controllers: [EstudiantesController],
  providers: [
    EstudiantesService, 
    PrismaEstudiantesService, 
    PrismaAcademicoService 
  ],
  exports: [EstudiantesService],
})
export class EstudiantesModule {} 