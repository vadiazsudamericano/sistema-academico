import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';

@Injectable()
export class EstudiantesService {
  constructor(
    private prisma: PrismaEstudiantesService,       
    private academicoPrisma: PrismaAcademicoService, 
  ) {} 
// PARTE 1: Listar estudiantes activos junto con su carrera
  async findActivosConCarrera() {
    const estudiantes = await this.prisma.estudiante.findMany({ 
      where: { estado: 'ACTIVO' } 
    });

    return Promise.all(
      estudiantes.map(async (est) => {
        const carrera = est.carreraId 
          ? await this.academicoPrisma.carrera.findUnique({ where: { id: est.carreraId } })
          : null;
        return { ...est, carrera };
      })
    );
  }

  async buscarLogico(carreraId: number) {
  return this.prisma.estudiante.findMany({
    where: {
      AND: [
        { estado: 'ACTIVO' },
        { carreraId: Number(carreraId) }
      ]
    }
  });
}

  // PARTE 3: Consulta SQL Nativa - Reporte de materias matriculadas
  async getReporteNativo() {
    return this.prisma.$queryRaw`
      SELECT 
        e.nombre AS "nombreEstudiante",
        e.email,
        COUNT(m.id) AS "totalMaterias"
      FROM "Estudiante" e
      LEFT JOIN "Matricula" m ON e.id = m."estudianteId"
      GROUP BY e.id, e.nombre, e.email
      ORDER BY "totalMaterias" DESC
    `;
  }
  async findAll() {
    return this.prisma.estudiante.findMany();
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({ 
      where: { id: Number(id) } 
    });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
  }

  async create(data: any) {
    return this.prisma.estudiante.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return this.prisma.estudiante.update({
      where: { id: Number(id) },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.estudiante.delete({ 
      where: { id: Number(id) } 
    });
  }

  async findActivos() {
    return this.prisma.estudiante.findMany({ 
      where: { estado: 'ACTIVO' } 
    });
  }

  async buscarAvanzado(query: any) {
    const estudiantes = await this.prisma.estudiante.findMany({
      where: {
        estado: query.estado || undefined,
        carreraId: query.carreraId ? Number(query.carreraId) : undefined,
      }
    });

    const estudiantesConCarrera = await Promise.all(
      estudiantes.map(async (estudiante) => {
        if (!estudiante.carreraId) return { ...estudiante, carrera: null };
        
        const carrera = await this.academicoPrisma.carrera.findUnique({
          where: { id: estudiante.carreraId }
        });
        
        return { ...estudiante, carrera };
      })
    );

    return estudiantesConCarrera;
  }
}