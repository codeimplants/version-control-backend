import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { VersionCheckDto } from './dto/version-check.dto';

@Controller('sdk')
export class SdkController {
    constructor(private sdk: SdkService) { }

    @Post('version/check')
    checkVersion(
        @Headers('x-api-key') apiKey: string,
        @Body() body: VersionCheckDto,
    ) {
        return this.sdk.checkVersion(apiKey, body);
    }

    @Get('stats')
    getStats(@Headers('x-api-key') apiKey: string) {
        return this.sdk.getAppStats(apiKey);
    }
}