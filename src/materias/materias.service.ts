import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaAcademicoService } from '../prisma/prisma-academico.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriasService {
  constructor(
    private readonly prismaAcademico: PrismaAcademicoService,
  ) {}

  async create(data: CreateMateriaDto) {
    if (!data || !data.nombre) {
      throw new BadRequestException('Datos inválidos para crear materia');
    }
    return this.prismaAcademico.materia.create({ data });
  }

  async findAll() {
    return this.prismaAcademico.materia.findMany();
  }

  async findOne(id: number) {
    const materia = await this.prismaAcademico.materia.findUnique({
      where: { id: Number(id) },
    });

    if (!materia) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }
    return materia;
  }

  async update(id: number, data: UpdateMateriaDto) {
    await this.findOne(id); // valida existencia

    return this.prismaAcademico.materia.update({
      where: { id: Number(id) },
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
      where: { id: Number(id) },
    });
  }
}