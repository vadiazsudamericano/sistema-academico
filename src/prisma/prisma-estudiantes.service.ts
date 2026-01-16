import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/estudiantes';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaEstudiantesService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ 
      user: 'postgres',
      host: 'localhost',
      database: 'estudiantes_db',
      password: '090306',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 [Prisma] Conexión establecida con ESTUDIANTES');
    } catch (error: any) {
      console.error('❌ [Prisma] Error en Estudiantes:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}