// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaEstudiantesService } from './prisma-estudiantes.service';
import { PrismaAcademicoService } from './prisma-academico.service';

@Global()
@Module({
  providers: [PrismaService, PrismaEstudiantesService, PrismaAcademicoService],
  exports: [PrismaService, PrismaEstudiantesService, PrismaAcademicoService],
})
export class PrismaModule {}