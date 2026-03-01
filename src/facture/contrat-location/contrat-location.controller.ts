import { Body, Controller, Post, Query } from '@nestjs/common';
import { ContratLocationService } from './contrat-location.service';

@Controller('facture-contrat-location')
export class ContratLocationController {
  constructor(private readonly contratLocationService: ContratLocationService) {}

  @Post('check-availability')
  checkAvailability(@Body() dto: any, @Query() query: any) {
    const authCode = query?.authCode || '';
    return this.contratLocationService.checkVehiculeAvailability(dto, authCode);
  }
}
