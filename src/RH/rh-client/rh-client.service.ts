import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './entities/rh-client.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class RhClientService extends BaseCrudService<Client> {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {
    super(clientModel);
  }
}
