import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { KillSwitchService } from './kill-switch.service';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('admin/kill-switch')
@UseGuards(JwtGuard)
export class KillSwitchController {
  constructor(private ks: KillSwitchService) {}

  @Post('toggle')
  toggle(@Body() body: { ruleId: string; status: boolean }) {
    return this.ks.toggle(body.ruleId, body.status);
  }
}