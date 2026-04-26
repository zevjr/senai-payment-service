import { Injectable, Logger } from '@nestjs/common';

export interface TransactionPayload {
  transactionId: string;
  amount: number;
  description: string;
  status: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  notifyTransactionReceived = (payload: TransactionPayload): void => {
    this.logger.log(
      `[NOTIFICAÇÃO] Solicitação de transação recebida | ID: ${payload.transactionId} | Valor: R$ ${payload.amount.toFixed(2)} | Descrição: ${payload.description} | Status: ${payload.status}`,
    );
  };

  notifyTransactionConfirmed = (payload: TransactionPayload): void => {
    this.logger.log(
      `[NOTIFICAÇÃO] Transação confirmada com sucesso | ID: ${payload.transactionId} | Valor: R$ ${payload.amount.toFixed(2)} | Descrição: ${payload.description} | Status: ${payload.status}`,
    );
  };
}
