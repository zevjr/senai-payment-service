import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, TransactionStatus } from '@prisma/client';
import { PaymentRepository } from './payment.repository';
import { MessagingService } from '../messaging/messaging.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly messagingService: MessagingService,
  ) {}

  createTransaction = async (dto: CreateTransactionDto): Promise<Transaction> => {
    const transaction = await this.paymentRepository.createTransaction(dto);

    await this.messagingService.publish('transaction.received', {
      transactionId: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
    });

    const confirmed = await this.paymentRepository.updateTransactionStatus(
      transaction.id,
      TransactionStatus.SUCCESS,
    );

    await this.messagingService.publish('transaction.confirmed', {
      transactionId: confirmed.id,
      amount: confirmed.amount,
      description: confirmed.description,
      status: confirmed.status,
    });

    return confirmed;
  };

  findAllTransactions = async (): Promise<Transaction[]> => {
    return this.paymentRepository.findAll();
  };

  findTransactionById = async (id: string): Promise<Transaction> => {
    const transaction = await this.paymentRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transação com id ${id} não encontrada`);
    }

    return transaction;
  };
}
