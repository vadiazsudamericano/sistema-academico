import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { PrismaAcademicoService } from '../prisma/prisma-academico.service'; 
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(
    private prisma: PrismaService, 
    private academicoPrisma: PrismaAcademicoService,
  ) {}

  async matricular(data: CreateMatriculaDto) {
    const materia = await this.academicoPrisma.materia.findUnique({
      where: { id: Number(data.materiaId) },
    });

    if (!materia) {
      throw new BadRequestException('La materia no existe en el registro académico');
    }

    if (materia.cupos <= 0) {
      throw new BadRequestException('No hay cupos disponibles para esta materia');
    }

    try {
 
      const nuevaMatricula = await this.prisma.matricula.create({
        data: {
          estudianteId: Number(data.estudianteId),
          materiaId: Number(data.materiaId),
          periodoAcademico: data.periodoAcademico,
          cicloId: Number(data.cicloId), 
        },
      });

      try {
      
        await this.academicoPrisma.materia.update({
          where: { id: Number(data.materiaId) },
          data: { cupos: { decrement: 1 } },
        });

        return nuevaMatricula;

      } catch (error) {
      
        await this.prisma.matricula.delete({ 
          where: { id: nuevaMatricula.id } 
        });
        throw new Error('Fallo al actualizar cupos. Matrícula revertida.');
      }

    } catch (error: any) {
      throw new BadRequestException(`Error en proceso de matrícula: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.matricula.findMany();
  }
}