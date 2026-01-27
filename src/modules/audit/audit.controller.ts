import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('admin/audit')
@UseGuards(JwtGuard)
export class AuditController {
    constructor(private audit: AuditService) { }

    @Get()
    getAll() {
        return this.audit.getAll();
    }
}