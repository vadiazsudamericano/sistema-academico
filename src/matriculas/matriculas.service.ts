import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { PrismaAcademicoService } from '../prisma/prisma-academico.service'; 
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(
    private prisma: PrismaService, 
    private academicoPrisma: PrismaAcademicoService,
    private estudiantesPrisma: PrismaEstudiantesService,
  ) {}

  async matricular(data: CreateMatriculaDto) {
    // 1. Validar si el estudiante existe y está activo
    const estudiante = await this.estudiantesPrisma.estudiante.findUnique({
      where: { id: Number(data.estudianteId) },
    });

    if (!estudiante || estudiante.estado !== 'ACTIVO') {
      throw new BadRequestException('El estudiante no existe o no está activo para matricularse');
    }

    // 2. Validar materia y cupos
    const materia = await this.academicoPrisma.materia.findUnique({
      where: { id: Number(data.materiaId) },
    });

    if (!materia) {
      throw new NotFoundException('La materia no existe en el registro académico');
    }

    if (materia.cupos <= 0) {
      throw new BadRequestException('No hay cupos disponibles para esta materia');
    }

    // 3. Proceso de Matrícula con compensación (Transacción manual)
    try {
      const nuevaMatricula = await this.prisma.matricula.create({
        data: {
          estudianteId: Number(data.estudianteId),
          materiaId: Number(data.materiaId),
          periodoAcademico: data.periodoAcademico || '2026-I',
          cicloId: Number(data.cicloId), 
        },
      });

      try {
        // Intentar descontar cupo
        await this.academicoPrisma.materia.update({
          where: { id: Number(data.materiaId) },
          data: { cupos: { decrement: 1 } },
        });

        return {
          message: 'Matrícula exitosa',
          matricula: nuevaMatricula
        };

      } catch (error) {
        // Si falla el cupo, revertimos la matrícula (Rollback manual)
        await this.prisma.matricula.delete({ 
          where: { id: nuevaMatricula.id } 
        });
        throw new BadRequestException('Error al actualizar cupos académicos. Matrícula revertida.');
      }

    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Fallo en el sistema de matrícula: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.matricula.findMany();
  }
}