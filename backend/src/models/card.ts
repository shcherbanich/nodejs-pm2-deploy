import { Schema, model, Types } from 'mongoose';

const urlRegExp = /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}
const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (v: string) => urlRegExp.test(v),
        message: 'Поле "link" должно быть валидным url-адресом.',
      },
    },
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'user' }], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);
cardSchema.set('toJSON', {
  transform(_doc, ret) {
    // eslint-disable-next-line no-param-reassign
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    ret.id = ret._id;
    // eslint-disable-next-line no-param-reassign
    delete ret._id;
    return ret;
  },
});
export default model<ICard>('card', cardSchema as any);
