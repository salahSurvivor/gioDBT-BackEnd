import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class BaseCrudService<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(query: any): Promise<T[]> {
    const authCode = query?.authCode || '';
    return this.model.find({authCode}).exec();
  }

  async find(query: any, dto: any): Promise<any> {
    const { authCode } = query;
    const { currentPage, paginatorNumber } = dto;

    // détecter automatiquement tous les champs avec un ref
    const populateFields = Object.values(this.model.schema.paths)
      .filter((p: any) => p.options?.ref)
      .map((p: any) => ({ path: p.path, select: 'nom' }));

    // total des documents
    const total = await this.model.countDocuments({ authCode });

    // données paginées
    let queryBuilder = this.model
      .find({ authCode })
      .sort({ _id: -1 })
      .limit(paginatorNumber)
      .skip((currentPage - 1) * paginatorNumber);

    populateFields.forEach(pop => {
      queryBuilder = queryBuilder.populate(pop);
    });

    const data = await queryBuilder.lean().exec();

    // retourner total + data
    return {
      total,
      data
    };
  }

  async findOne(id: string): Promise<T> {
    const item = await this.model.findById(id).exec();
    if (!item) throw new NotFoundException(`${this.model.modelName} #${id} not found`);
    return item;
  }

  async update(id: string, updateDto: any): Promise<T> {
    const updated = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`${this.model.modelName} #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`${this.model.modelName} #${id} not found`);
  }
}