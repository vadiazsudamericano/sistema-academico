import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';

@Injectable()
export class MatriculasService {
  constructor(
    private prisma: PrismaService,
    private academicoPrisma: PrismaAcademicoService,
  ) {}

  async matricular(data: any) {
    const materia = await this.academicoPrisma.materia.findUnique({
      where: { id: data.materiaId },
    });

    if (!materia) throw new BadRequestException('La materia no existe');
    if (materia.cupos <= 0) throw new BadRequestException('No hay cupos disponibles');

    
    return this.prisma.$transaction(async (tx) => {
     
      const nuevaMatricula = await tx.matricula.create({
        data: {
          estudianteId: data.estudianteId,
          materiaId: data.materiaId,
          periodoAcademico: data.periodoAcademico,
        },
      });

      await this.academicoPrisma.materia.update({
        where: { id: data.materiaId },
        data: { cupos: materia.cupos - 1 },
      });

      return nuevaMatricula;
    });
  }

  async findAll() {
    return this.prisma.matricula.findMany();
  }
}