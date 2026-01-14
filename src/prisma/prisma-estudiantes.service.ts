import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/estudiantes';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaEstudiantesService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ 
      connectionString: process.env.ESTUDIANTES_DATABASE_URL 
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 [Prisma] Conexión establecida con ESTUDIANTES_DATABASE_URL');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ [Prisma] Error en BD Estudiantes:', message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}