import { Module } from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CarrerasController } from './carreras.controller';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';

@Module({
  controllers: [CarrerasController],
  providers: [
    CarrerasService, 
    PrismaAcademicoService, 
    PrismaEstudiantesService
  ],
})
export class CarrerasModule {}