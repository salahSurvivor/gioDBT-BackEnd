import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
//-----------------------------------Flotte section------------------------------------
import { VehiculeService } from '../flotte/vehicule/vehicule.service';
import { VehiculeMarqueService } from '../flotte/vehicule-marque/vehicule-marque.service';
import { VehiculeModeleService } from '../flotte/vehicule-modele/vehicule-modele.service';
import { VehiculeCarburantService } from '../flotte/vehicule-carburant/vehicule-carburant.service';
import { FlotteAffectationService } from '../flotte/flotte-affectation/flotte-affectation.service';
import { FlotteAssuranceService } from '../flotte/flotte-assurance/flotte-assurance.service';
import { FlotteAdblueService } from '../flotte/flotte-adblue/flotte-adblue.service';
import { AssuranceCompagnieService } from '../flotte/assurance-compagnie/assurance-compagnie.service';
import { AssuranceTypeService } from '../flotte/assurance-type/assurance-type.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

//-----------------------------------RH section------------------------------------------
import { RhCollaborateurService } from '../RH/rh-collaborateur/rh-collaborateur.service';

@Controller(':entity')
@UseGuards(JwtAuthGuard)
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
    private readonly assuranceCompagnieService: AssuranceCompagnieService,
    private readonly assuranceTypeService: AssuranceTypeService,
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
      case 'assurance-compagnie':
        return this.assuranceCompagnieService;
      case 'assurance-type':
        return this.assuranceTypeService;
      //---------------------RH Section-----------------------
      case 'rh-collaborateur':
        return this.rhCollaborateurService;
      default:
        throw new Error('Entity not found');
    }
  }

  private canWrite(user: any): boolean {
    if (user?.role === 'entreprise') return true;
    if (user?.role !== 'member') return false;
    return user?.permission === 'admin' || user?.permission === 'editor';
  }

  private canDelete(user: any): boolean {
    if (user?.role === 'entreprise') return true;
    if (user?.role !== 'member') return false;
    return user?.permission === 'admin';
  }

  private ensureAuthScope(user: any): void {
    if (user?.role === 'member' && !user?.authCode) {
      throw new ForbiddenException('Compte membre sans scope entreprise');
    }
  }

  @Post()
  create(
    @Param('entity') entity: string,
    @Body() dto: any,
    @Query() query: any,
    @Req() req: any,
  ) {
    this.ensureAuthScope(req.user);

    const entrepriseId =
      req.user?.role === 'entreprise' ? req.user?.id : req.user?.entrepriseId;
    if (entrepriseId) {
      query.entrepriseId = entrepriseId;
    }

    if (req.user?.authCode) {
      query.authCode = req.user.authCode;
      if (dto && typeof dto === 'object') {
        dto.authCode = req.user.authCode;
      }
    }

    const { paginatorSystem } = query;
    const service = this.getService(entity);
    if (paginatorSystem) return service.find(query, dto);

    if (!this.canWrite(req.user)) {
      throw new ForbiddenException('Permission insuffisante pour crÃ©er');
    }

    return service.create(dto);
  }

  @Get()
  async findAll(@Param('entity') entity: string, @Query() query: any, @Req() req: any) {
    this.ensureAuthScope(req.user);

    const entrepriseId =
      req.user?.role === 'entreprise' ? req.user?.id : req.user?.entrepriseId;
    if (entrepriseId) {
      query.entrepriseId = entrepriseId;
    }

    if (req.user?.authCode) {
      query.authCode = req.user.authCode;
    }

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

    const service = this.getService(entity);
    return service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('entity') entity: string, @Param('id') id: string) {
    const service = this.getService(entity);
    return service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    this.ensureAuthScope(req.user);

    if (req.user?.authCode && dto && typeof dto === 'object') {
      dto.authCode = req.user.authCode;
    }

    if (!this.canWrite(req.user)) {
      throw new ForbiddenException('Permission insuffisante pour modifier');
    }

    const service = this.getService(entity);
    return service.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    this.ensureAuthScope(req.user);

    if (!this.canDelete(req.user)) {
      throw new ForbiddenException('Permission insuffisante pour supprimer');
    }

    const service = this.getService(entity);
    return service.remove(id);
  }
}
