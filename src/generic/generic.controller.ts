import { Controller, Get, Post, Body, Param, Patch, Delete, Query  } from '@nestjs/common';
import { VehiculeService } from '../flotte/vehicule/vehicule.service';
import { VehiculeMarqueService } from '../flotte/vehicule-marque/vehicule-marque.service';
import { VehiculeModeleService } from '../flotte/vehicule-modele/vehicule-modele.service';
import { VehiculeCarburantService } from '../flotte/vehicule-carburant/vehicule-carburant.service';
import { RhCollaborateurService } from '../RH/rh-collaborateur/rh-collaborateur.service';

@Controller(':entity') // endpoint dynamique
export class GenericController {
  constructor(
    private readonly vehiculeService: VehiculeService,
    private readonly vehiculeMarqueService: VehiculeMarqueService,
    private readonly vehiculeModeleService: VehiculeModeleService,
    private readonly vehiculeCarburantService: VehiculeCarburantService,
    private readonly rhCollaborateurService: RhCollaborateurService
  ) {}

  private getService(entity: string) {
    switch (entity) {
      case 'vehicule':
        return this.vehiculeService; 
      case 'vehicule-marque':
        return this.vehiculeMarqueService;
      case 'vehicule-modele':
        return this.vehiculeModeleService;
      case 'vehicule-carburant':
        return this.vehiculeCarburantService;
      case 'rh-collaborateur':
        return this.rhCollaborateurService;
      default:
        throw new Error('Entity not found');
    }
  }

  @Post()
  create(@Param('entity') entity: string, @Body() dto: any, @Query() query: any) {
    const { paginatorSystem } = query;
    const service = this.getService(entity);
    if (paginatorSystem)
      return service.find(query, dto);

    return service.create(dto);
  }

  @Get()
  async findAll(@Param('entity') entity: string, @Query() query: any) {
    if (entity === 'vehicule') {
      return {
        vehiculeMarqueList: await this.vehiculeMarqueService.findAll(query),
        vehiculeModeleList: await this.vehiculeModeleService.findAll(query),
        vehiculeCarburantList: await this.vehiculeCarburantService.findAll(query),
      };
    }
    const service = this.getService(entity);
    return service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('entity') entity: string, @Param('id') id: string) {
    const service = this.getService(entity);
    return service.findOne(id);
  }

  @Patch(':id')
  update(@Param('entity') entity: string, @Param('id') id: string, @Body() dto: any) {
    const service = this.getService(entity);
    return service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('entity') entity: string, @Param('id') id: string) {
    const service = this.getService(entity);
    return service.remove(id);
  }
}
