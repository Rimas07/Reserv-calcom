import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuditService } from './audit.service.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        this.audit.log({
          action: `${req.method} ${req.originalUrl || req.url}`,
          entity: 'http',
          userId: (req as any).user?.userId,
          details: {
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
          },
        });
      }),
      catchError((err) => {
        this.audit.log({
          action: `${req.method} ${req.originalUrl || req.url}`,
          entity: 'http',
          userId: (req as any).user?.userId,
          details: {
            statusCode: err?.status || 500,
            durationMs: Date.now() - start,
            error: err.message,
          },
        });
        return throwError(() => err);
      }),
    );
  }
}
