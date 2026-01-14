import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/academico';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaAcademicoService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ 
      connectionString: process.env.ACADEMICO_DATABASE_URL 
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 [Prisma] Conexión establecida con ACADEMICO_DATABASE_URL');
    } catch (error: unknown) {
      // Solución al error de TS: Validamos si es una instancia de Error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ [Prisma] Error conectando a la base de datos Académico:', errorMessage);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}