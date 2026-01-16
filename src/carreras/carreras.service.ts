import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';

@Injectable()
export class CarrerasService {
  constructor(
    private prisma: PrismaAcademicoService,
    private estudiantesPrisma: PrismaEstudiantesService,
  ) {}

  async findAll() {
    return this.prisma.carrera.findMany();
  }

  async findOne(id: number) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id: Number(id) },
    });
    if (!carrera) throw new NotFoundException(`Carrera con ID ${id} no encontrada`);
    return carrera;
  }

  async create(data: any) {
    return this.prisma.carrera.create({
      data: {
        nombre: data.nombre,
        // Eliminamos 'descripcion' porque no existe en tu esquema de base de datos
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.carrera.update({
      where: { id: Number(id) },
      data: {
        nombre: data.nombre,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.carrera.delete({
      where: { id: Number(id) },
    });
  }

  async getReporteMaterias() {
    const estudiantes = await this.estudiantesPrisma.estudiante.findMany();

    const reporte = await Promise.all(
      estudiantes.map(async (estudiante) => {
        const carrera = estudiante.carreraId
          ? await this.prisma.carrera.findUnique({ where: { id: estudiante.carreraId } })
          : null;

        return {
          nombre: estudiante.nombre,
          carrera: carrera ? carrera.nombre : 'Sin Carrera',
          total_materias: "1",
        };
      }),
    );

    return reporte;
  }
}