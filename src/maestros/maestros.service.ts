import { Injectable } from '@nestjs/common';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';

@Injectable()
export class MaestrosService {
  constructor(private prisma: PrismaAcademicoService) {}

  async findAll() { 
    return this.prisma.maestro.findMany(); 
  }

  async findOne(id: number) { 
    return this.prisma.maestro.findUnique({ where: { id: Number(id) } }); 
  }

  async create(data: any) { 
    return this.prisma.maestro.create({ data }); 
  }

  async update(id: number, data: any) { 
    return this.prisma.maestro.update({ where: { id: Number(id) }, data }); 
  }

  async remove(id: number) { 
    return this.prisma.maestro.delete({ where: { id: Number(id) } }); 
  }

  // PARTE 1: Listar docentes que imparten más de una asignatura
  // Corregido para contar materias de forma externa y evitar errores de esquema
  async findDocentesCargados() {
    const maestros = await this.prisma.maestro.findMany();
    const resultados = await Promise.all(
      maestros.map(async (m) => {
        const count = await this.prisma.materia.count({
          where: { maestroId: m.id }
        });
        return { ...m, totalMaterias: count };
      })
    );
    return resultados.filter(m => m.totalMaterias > 1);
  }

  // PARTE 2: Operaciones Lógicas (AND, OR, NOT)
  // Filtra por contrato, dictado de materias (externo) y estado
  async filtroAvanzadoLogico() {
    // Primero obtenemos los maestros que cumplen con el contrato y el estado
    const maestros = await this.prisma.maestro.findMany({
      where: {
        AND: [
          { tipoContrato: 'TIEMPO_COMPLETO' },
          {
            OR: [
              { estado: 'ACTIVO' },
              { NOT: { estado: 'INACTIVO' } }
            ]
          }
        ]
      }
    });

    // Filtramos manualmente los que dictan asignaturas si no hay relación en Prisma
    const conMaterias = await Promise.all(
      maestros.map(async (m) => {
        const tieneMaterias = await this.prisma.materia.count({ where: { maestroId: m.id } });
        return tieneMaterias > 0 ? m : null;
      })
    );

    return conMaterias.filter(m => m !== null);
  }

  // PARTE 2: Consulta que utiliza operadores lógicos solicitada en el punto 3
  async buscarFiltroEspecial(query: any) {
    return this.prisma.maestro.findMany({
      where: {
        AND: [
          { tipoContrato: query?.tipo || undefined },
          { 
            OR: [
              { estado: 'ACTIVO' },           
              { especialidad: 'Sistemas' }    
            ]
          },
          {
            NOT: {
              salario: { lt: 1000 } 
            }
          }
        ]
      },
      orderBy: { nombre: 'asc' }
    });
  }
}