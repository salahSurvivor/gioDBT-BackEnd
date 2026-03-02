import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class BaseCrudService<T extends Document> {
  constructor(private readonly model: Model<T>) { }

  private parseDateFilterValue(value: any): Date | null {
    if (!value) return null;

    if (typeof value === 'string') {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
        const localDate = new Date(year, month, day);
        return Number.isNaN(localDate.getTime()) ? null : localDate;
      }
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  async create(createDto: any): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(query: any): Promise<T[]> {
    const authCode = query?.authCode || '';
    return this.model.find({ authCode }).exec();
  }

  async find(query: any, dto: any): Promise<any> {
    const { authCode } = query;
    const { currentPage, paginatorNumber, recordFilter } = dto;

    const filter: any = { authCode };

    if (recordFilter && typeof recordFilter === 'object') {
      Object.keys(recordFilter).forEach(key => {
        const value = recordFilter[key];
        if (value === null || value === undefined || value === '') {
          return;
        }

        if (key.endsWith('From') || key.endsWith('To')) {
          const date = this.parseDateFilterValue(value);
          if (!date) {
            return;
          }

          const field = key.endsWith('From')
            ? key.slice(0, -4)
            : key.slice(0, -2);

          if (!field) {
            return;
          }

          if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
            filter[field] = {};
          }

          if (key.endsWith('From')) {
            date.setHours(0, 0, 0, 0);
            filter[field].$gte = date;
          } else {
            date.setHours(23, 59, 59, 999);
            filter[field].$lte = date;
          }
          return;
        }

        filter[key] = value;
      });
    }
    console.log('filtre:', filter);

    // détecter automatiquement tous les champs avec un ref
    const populateFields = Object.values(this.model.schema.paths)
      .filter((p: any) => p.options?.ref)
      .map((p: any) => ({ path: p.path }));

    // total des documents
    const total = await this.model.countDocuments(filter);

    // données paginées
    let queryBuilder = this.model
      .find(filter)
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
    const payload = { ...(updateDto || {}) };
    delete payload._id;
    delete payload.id;
    delete payload.__v;
    delete payload.createdAt;

    const updated = await this.model
      .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .exec();
    if (!updated) throw new NotFoundException(`${this.model.modelName} #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`${this.model.modelName} #${id} not found`);
  }
}
