import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return await this.prisma.usuario.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'ADMIN',
      },
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return await this.prisma.usuario.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.usuario.delete({ where: { id } });
  }
}