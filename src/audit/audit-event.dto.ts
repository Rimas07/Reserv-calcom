export class AuditEventDto {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, any>;
}
