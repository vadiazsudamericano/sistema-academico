import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaAcademicoService } from '../prisma/prisma-academico.service';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';
import { PrismaService } from '../prisma/prisma.service';

import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriasService {
  constructor(
    private readonly prismaAcademico: PrismaAcademicoService,     
    private readonly prismaEstudiantes: PrismaEstudiantesService, 
    private readonly prismaGeneral: PrismaService,                
  ) {}

  /* 
     CRUD MATERIAS
     */

  async create(data: CreateMateriaDto) {
    if (!data || !data.nombre) {
      throw new BadRequestException('Datos inválidos para crear materia');
    }

    return this.prismaAcademico.materia.create({
      data,
    });
  }

  async findAll() {
    return this.prismaAcademico.materia.findMany();
  }

  async findOne(id: number) {
    const materia = await this.prismaAcademico.materia.findUnique({
      where: { id },
    });

    if (!materia) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }

    return materia;
  }

  async update(id: number, data: UpdateMateriaDto) {
    await this.findOne(id); // valida existencia

    return this.prismaAcademico.materia.update({
      where: { id },
      data: {
        ...data,
        carreraId: data.carreraId ? Number(data.carreraId) : undefined,
        maestroId: data.maestroId ? Number(data.maestroId) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaAcademico.materia.delete({
      where: { id },
    });
  }

  /* =========================
     PARTE 4 – TRANSACCIÓN (ACID)
     ========================= */

  async realizarMatricula(
    estudianteId: number,
    materiaId: number,
    cicloId: number,
  ) {
    /*  Validar estudiante (DB Estudiantes) */
    const estudiante = await this.prismaEstudiantes.estudiante.findUnique({
      where: { id: estudianteId },
    });

    if (!estudiante || estudiante.estado !=='ACTIVO') {
      throw new BadRequestException(
        'Estudiante no existe o se encuentra inactivo',
      );
    }

    /* Validar materia y cupos (DB Académico) */
    const materia = await this.prismaAcademico.materia.findUnique({
      where: { id: materiaId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    if (materia.cupos <= 0) {
      throw new BadRequestException('No hay cupos disponibles');
    }

    /* Registrar matrícula (DB General) */
    const matricula = await this.prismaGeneral.matricula.create({
      data: {
        estudianteId,
        materiaId,
        cicloId,
        periodoAcademico: '2026-I',
      },
    });

    /* Descontar cupo – compensación si falla */
    try {
      await this.prismaAcademico.materia.update({
        where: { id: materiaId },
        data: {
          cupos: { decrement: 1 },
        },
      });

      return {
        ok: true,
        message: 'Matrícula realizada correctamente',
        matricula,
      };
    } catch (error) {
      // Rollback manual (compensación)
      await this.prismaGeneral.matricula.delete({
        where: { id: matricula.id },
      });

      throw new BadRequestException(
        'Error al actualizar cupos. Matrícula revertida.',
      );
    }
  }
}
