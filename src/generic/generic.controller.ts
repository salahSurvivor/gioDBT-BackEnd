import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
//-----------------------------------Flotte section------------------------------------
import { VehiculeService } from '../flotte/vehicule/vehicule.service';
import { VehiculeMarqueService } from '../flotte/vehicule-marque/vehicule-marque.service';
import { VehiculeModeleService } from '../flotte/vehicule-modele/vehicule-modele.service';
import { VehiculeCarburantService } from '../flotte/vehicule-carburant/vehicule-carburant.service';
import { FlotteAffectationService } from '../flotte/flotte-affectation/flotte-affectation.service';
import { FlotteAssuranceService } from '../flotte/flotte-assurance/flotte-assurance.service';
import { FlotteAdblueService } from '../flotte/flotte-adblue/flotte-adblue.service';
import { FlotteVignetteService } from '../flotte/flotte-vignette/flotte-vignette.service';
import { AssuranceCompagnieService } from '../flotte/assurance-compagnie/assurance-compagnie.service';
import { AssuranceTypeService } from '../flotte/assurance-type/assurance-type.service';
import { RhClientService } from '../RH/rh-client/rh-client.service';
import { ContratLocationService } from '../facture/contrat-location/contrat-location.service';
import { FactureClientService } from '../facture/facture-client/facture-client.service';

//-----------------------------------RH section------------------------------------------
import { RhCollaborateurService } from '../RH/rh-collaborateur/rh-collaborateur.service';

@Controller(':entity')
export class GenericController {
  constructor(
    private readonly vehiculeService: VehiculeService,
    private readonly vehiculeMarqueService: VehiculeMarqueService,
    private readonly vehiculeModeleService: VehiculeModeleService,
    private readonly vehiculeCarburantService: VehiculeCarburantService,
    private readonly rhCollaborateurService: RhCollaborateurService,
    private readonly flotteAffectationService: FlotteAffectationService,
    private readonly flotteAssuranceService: FlotteAssuranceService,
    private readonly flotteAdblueService: FlotteAdblueService,
    private readonly flotteVignetteService: FlotteVignetteService,
    private readonly assuranceCompagnieService: AssuranceCompagnieService,
    private readonly assuranceTypeService: AssuranceTypeService,
    private readonly rhClientService: RhClientService,
    private readonly contratLocationService: ContratLocationService,
    private readonly factureClientService: FactureClientService,
  ) {}

  private getService(entity: string) {
    switch (entity) {
      //------------------Flotte Section----------------------
      case 'vehicule':
        return this.vehiculeService;
      case 'vehicule-marque':
        return this.vehiculeMarqueService;
      case 'vehicule-modele':
        return this.vehiculeModeleService;
      case 'vehicule-carburant':
        return this.vehiculeCarburantService;
      case 'flotte-affectation':
        return this.flotteAffectationService;
      case 'flotte-assurance':
        return this.flotteAssuranceService;
      case 'flotte-adblue':
        return this.flotteAdblueService;
      case 'flotte-vignette':
        return this.flotteVignetteService;
      case 'assurance-compagnie':
        return this.assuranceCompagnieService;
      case 'assurance-type':
        return this.assuranceTypeService;
      case 'rh-client':
        return this.rhClientService;
      case 'facture-contrat-location':
        return this.contratLocationService;
      case 'facture-client':
        return this.factureClientService;
      //---------------------RH Section-----------------------
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
    if (paginatorSystem) return service.find(query, dto);

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

    if (entity === 'flotte-assurance') {
      return {
        vehiculeList: await this.vehiculeService.findAll(query),
        assuranceCompagnieList: await this.assuranceCompagnieService.findAll(query),
        assuranceTypeList: await this.assuranceTypeService.findAll(query),
      };
    }

    if (entity === 'flotte-adblue') {
      return {
        vehiculeList: await this.vehiculeService.findAll(query),
      };
    }

    if (entity === 'flotte-vignette') {
      return {
        vehiculeList: await this.vehiculeService.findAll(query),
      };
    }

    if (entity === 'facture-contrat-location') {
      return {
        vehiculeList: await this.vehiculeService.findAll(query),
        clientList: await this.rhClientService.findAll(query),
      };
    }

    if (entity === 'facture-client') {
      return {
        vehiculeList: await this.vehiculeService.findAll(query),
        clientList: await this.rhClientService.findAll(query),
        locationList: await this.contratLocationService.findAll(query),
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
