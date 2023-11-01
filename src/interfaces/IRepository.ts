export interface IRepository<Entity> {
  delete(criteria: any): Promise<any>;
  find(options?: any): Promise<Entity[]>;
  findOne(options: any): Promise<Entity | null>;
  findOneBy(where: any | any[]): Promise<Entity | null>;
  findBy(where: any | any[]): Promise<Entity[]>;
  create(entityLike: any): Entity;
  save(entity: Entity, options?: any): Promise<Entity>;
}
