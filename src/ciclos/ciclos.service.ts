import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // DB Principal
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Injectable()
export class CiclosService {
  // Aquí usamos el PrismaService general porque el modelo está en schema.prisma
  constructor(private prisma: PrismaService) {}

  create(data: CreateCicloDto) {
    return this.prisma.ciclo.create({ data });
  }

  findAll() {
    return this.prisma.ciclo.findMany();
  }

  findOne(id: number) {
    return this.prisma.ciclo.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCicloDto) {
    return this.prisma.ciclo.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.ciclo.delete({ where: { id } });
  }
}