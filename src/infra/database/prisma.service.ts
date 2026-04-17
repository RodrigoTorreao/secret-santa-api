import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { prismaClient } from './prisma.client'

@Injectable()
export class PrismaService
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await prismaClient.$connect()
  }

  async onModuleDestroy() {
    await prismaClient.$disconnect()
  }

  get client() {
    return prismaClient
  }
}