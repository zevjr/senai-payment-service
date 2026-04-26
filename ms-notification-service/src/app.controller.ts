import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      service: 'ms-notification-service',
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }
}
