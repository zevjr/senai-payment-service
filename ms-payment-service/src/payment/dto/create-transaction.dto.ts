import { IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;
}
