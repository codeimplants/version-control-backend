import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SdkService } from './sdk.service';

@Controller('sdk')
export class SdkController {
    constructor(private sdk: SdkService) { }

    @Post('version/check')
    checkVersion(
        @Headers('x-api-key') apiKey: string,
        @Body() body: { appId: string; platform: string; version: string; environment: string }
    ) {
        return this.sdk.checkVersion(apiKey, body);
    }
}