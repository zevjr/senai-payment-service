import { Body, Controller, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTransactionDto) {
    return this.paymentService.createTransaction(dto);
  }

  @Get('test')
  test() {
    const dto: CreateTransactionDto = { amount: 99.9, description: 'Transacao de teste' };
    return this.paymentService.createTransaction(dto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAllTransactions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findTransactionById(id);
  }
}
