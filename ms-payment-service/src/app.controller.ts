import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      service: 'ms-payment-service',
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }
}
