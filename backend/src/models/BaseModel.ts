import { Model, InferAttributes, InferCreationAttributes, ModelStatic } from 'sequelize';

export class BaseModel<
  M extends Model = Model,
  T extends ModelStatic<M> = ModelStatic<M>
> extends Model<InferAttributes<M>, InferCreationAttributes<M>> {
  declare id: number;
}
