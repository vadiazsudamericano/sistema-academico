import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEstudianteDto) {
    return this.prisma.estudiante.create({ data });
  }

  findAll() {
    return this.prisma.estudiante.findMany();
  }

  findOne(id: number) {
    return this.prisma.estudiante.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateEstudianteDto) {
    return this.prisma.estudiante.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.estudiante.delete({ where: { id } });
  }
}
