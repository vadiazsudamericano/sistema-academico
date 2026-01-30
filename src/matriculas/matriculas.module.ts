import { Module } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaAcademicoService } from 'src/prisma/prisma-academico.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaEstudiantesService } from 'src/prisma/prisma-estudiantes.service';

@Module({
  controllers: [MatriculasController],
  providers: [
    MatriculasService, 
    PrismaService, 
    PrismaAcademicoService,
    PrismaEstudiantesService
  ],
})
export class MatriculasModule {}