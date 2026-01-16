import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaEstudiantesService } from '../prisma/prisma-estudiantes.service';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';

@Injectable()
export class EstudiantesService {
  constructor(
    private prisma: PrismaEstudiantesService,       
    private academicoPrisma: PrismaAcademicoService, 
  ) {} 

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
      data: {
        nombre: data.nombre,
        email: data.email,
        carreraId: data.carreraId ? Number(data.carreraId) : null,
        estado: 'ACTIVO',
      },
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