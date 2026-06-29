import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config'; // Ensures your .env variables are actively loaded

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Initialize a native PostgreSQL connection pool using your .env string
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Wrap that pool securely within the Prisma v7 database adapter
    const adapter = new PrismaPg(pool);

    // 3. Forward the driver adapter straight to the parent Prisma engine
    super({ adapter });
  }

  async onModuleInit() {
    // Triggers the active connection tunnel to your Docker PostgreSQL container
    // Connection check happens in main.ts before server starts listening
    await this.$connect();
  }

  async onModuleDestroy() {
    // Gracefully cuts connection strings when your NestJS server shuts down
    await this.$disconnect();
  }
}
