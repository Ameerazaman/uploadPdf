import { BaseRepositoryInterface } from "../Interface/BaseRepositoryInterface";


export class BaseRepository<T> implements BaseRepositoryInterface<T> {
  protected  model: any;

  constructor(model: any) {
    this.model = model;
  }

  // Create a new entity
  async create(data: T): Promise<T> {
    try {
      const entity = await this.model.create(data);
      return entity;
    } catch (error) {
      throw new Error('Error creating entity: ');
    }
  }

  // Get an entity by ID
  async getById(id: string): Promise<T | null> {
    try {
      const entity = await this.model.findById(id);
      return entity;
    } catch (error) {
      throw new Error('Error retrieving entity by ID: ');
    }
  }

  // Update an entity
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const updatedEntity = await this.model.findByIdAndUpdate(id, data, { new: true });
      return updatedEntity;
    } catch (error) {
      throw new Error('Error updating entity: ' );
    }
  }

  // Delete an entity by ID
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result ? true : false;
    } catch (error) {
      throw new Error('Error deleting entity: ');
    }
  }

  // Get all entities (optional)
  async getAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error('Error retrieving entities: ');
    }
  }
}