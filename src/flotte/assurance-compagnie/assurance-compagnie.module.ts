import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssuranceCompagnieService } from './assurance-compagnie.service';
import {
  AssuranceCompagnie,
  AssuranceCompagnieSchema,
} from './entities/assurance-compagnie.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssuranceCompagnie.name, schema: AssuranceCompagnieSchema },
    ]),
  ],
  providers: [AssuranceCompagnieService],
  exports: [AssuranceCompagnieService],
})
export class AssuranceCompagnieModule {}
