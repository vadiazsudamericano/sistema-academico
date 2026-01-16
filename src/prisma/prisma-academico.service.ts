import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/academico';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaAcademicoService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ 
      user: 'postgres',
      host: 'localhost',
      database: 'academico_db', 
      password: '090306',      
      port: 5432,
      max: 10,
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 [Prisma] Conexión establecida con ACADEMICO');
    } catch (error: any) {
      console.error('❌ [Prisma] Error en Academico:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}