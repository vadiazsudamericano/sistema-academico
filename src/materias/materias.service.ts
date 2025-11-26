import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMateriaDto) {
    return this.prisma.materia.create({ data });
  }

  findAll() {
    return this.prisma.materia.findMany();
  }

  findOne(id: number) {
    return this.prisma.materia.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateMateriaDto) {
    return this.prisma.materia.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.materia.delete({ where: { id } });
  }
}
