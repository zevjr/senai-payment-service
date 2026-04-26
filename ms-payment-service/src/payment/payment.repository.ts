import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTransaction = async (dto: CreateTransactionDto): Promise<Transaction> => {
    return this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        description: dto.description,
        status: TransactionStatus.PENDING,
      },
    });
  };

  updateTransactionStatus = async (
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> => {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  };

  findAll = async (): Promise<Transaction[]> => {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  };

  findById = async (id: string): Promise<Transaction | null> => {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  };
}
