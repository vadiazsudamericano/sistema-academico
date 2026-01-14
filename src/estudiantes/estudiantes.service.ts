import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaEstudiantesService) {} 

  async findAll() {
    return this.prisma.estudiante.findMany();
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({ where: { id } });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
  }

  async create(data: any) {
    return this.prisma.estudiante.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.estudiante.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.estudiante.delete({ where: { id } });
  }

  async findActivos() {
    return this.prisma.estudiante.findMany({ where: { estado: 'ACTIVO' } });
  }

  async buscarAvanzado(query: any) {
    return this.prisma.estudiante.findMany({ where: query });
  }

  async getReporteMaterias() {
    try {
      return await this.prisma.$queryRaw`
        SELECT 
          "nombre", 
          'Ingeniería en Sistemas' AS "carrera", 
          '1' AS "total_materias"
        FROM "Estudiante"
        LIMIT 10;
      `;
    } catch (error: any) {
      return { message: "Error en reporte", error: error.message };
    }
  }
}