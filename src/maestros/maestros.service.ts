import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaestroDto } from './dto/create-maestro.dto';
import { UpdateMaestroDto } from './dto/update-maestro.dto';

@Injectable()
export class MaestrosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMaestroDto) {
    return this.prisma.maestro.create({ data });
  }

  findAll() {
    return this.prisma.maestro.findMany({
      include: { carrera: true }, // ✅ opcional: para traer la carrera
    });
  }

  findOne(id: number) {
    return this.prisma.maestro.findUnique({
      where: { id },
      include: { carrera: true },
    });
  }

  update(id: number, data: UpdateMaestroDto) {
    return this.prisma.maestro.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.maestro.delete({
      where: { id },
    });
  }
}
