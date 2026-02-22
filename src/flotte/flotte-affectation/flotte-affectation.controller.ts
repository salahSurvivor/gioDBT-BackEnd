import { Body, Controller, Post, Query } from '@nestjs/common';
import { FlotteAffectationService } from './flotte-affectation.service';

@Controller('flotte-affectation')
export class FlotteAffectationController {
  constructor(
    private readonly flotteAffectationService: FlotteAffectationService,
  ) {}

  @Post('check-availability')
  checkAvailability(@Body() dto: any, @Query() query: any) {
    const authCode = query?.authCode || '';
    return this.flotteAffectationService.checkVehiculeAvailability(dto, authCode);
  }
}
