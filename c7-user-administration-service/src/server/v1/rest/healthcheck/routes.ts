import { Get, Route } from 'tsoa';
import HealthCheckResponse from './types';

@Route('v1/healthcheck')
export class HealthCheckRoute {
  @Get()
  public getHealthStatus(): HealthCheckResponse {
    return {
      data: 'running',
      message: 'Your api is healthy :)',
      status: 200,
    };
  }
}
