import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ContratLocationService } from './contrat-location.service';

@Controller('facture-contrat-location')
export class ContratLocationController {
  constructor(private readonly contratLocationService: ContratLocationService) {}

  @Post('check-availability')
  checkAvailability(@Body() dto: any, @Query() query: any) {
    const authCode = query?.authCode || '';
    return this.contratLocationService.checkVehiculeAvailability(dto, authCode);
  }

  @Get(':id/pdf')
  async downloadPdf(
    @Param('id') id: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const authCode = query?.authCode || '';
    const pdfBuffer = await this.contratLocationService.generateContratPdf(id, authCode);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contrat-location-${id}.pdf`);
    res.send(pdfBuffer);
  }
}
