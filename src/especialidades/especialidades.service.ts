import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEspecialidadDto } from './dto/create-especialidade.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidade.dto';

@Injectable()
export class EspecialidadesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEspecialidadDto) {
    return this.prisma.especialidad.create({ data });
  }

  findAll() {
    return this.prisma.especialidad.findMany();
  }

  findOne(id: number) {
    return this.prisma.especialidad.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateEspecialidadDto) {
    return this.prisma.especialidad.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.especialidad.delete({ where: { id } });
  }
}
