import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCarreraDto) {
    return this.prisma.carrera.create({ data });
  }

  findAll() {
    return this.prisma.carrera.findMany();
  }

  findOne(id: number) {
    return this.prisma.carrera.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCarreraDto) {
    return this.prisma.carrera.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.carrera.delete({ where: { id } });
  }
}
