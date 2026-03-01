import { Body, Controller, Post, Query } from '@nestjs/common';
import { FactureClientService } from './facture-client.service';

@Controller('facture-client')
export class FactureClientController {
  constructor(private readonly factureClientService: FactureClientService) {}

  @Post('generate-from-location')
  generateFromLocation(@Body() dto: any, @Query() query: any) {
    const authCode = query?.authCode || '';
    return this.factureClientService.generateFromLocation(dto, authCode);
  }
}
