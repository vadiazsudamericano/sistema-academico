import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Esto carga las variables ANTES de que la clase se defina
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn('Prisma: DATABASE_URL no está configurada. Asegúrate de tener .env con DATABASE_URL');
      super();
      return;
    }

    super({ datasources: { db: { url } } } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma 7 conectado con éxito');
    } catch (error) {
      console.error('❌ Error en conexión Prisma 7:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}