// src/models/user.ts
import mongoose, { Model, HydratedDocument } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'; // импортируем bcrypt
import { urlRegExp } from '../middlewares/validatons';
import UnauthorizedError from '../errors/unauthorized-error';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface IUserMethods {
  toJSON(this: HydratedDocument<IUser, IUserMethods>): Omit<IUser, 'password'> & { _id: any };
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => urlRegExp.test(v),
        message: 'Поле "avatar" должно быть валидным url-адресом.',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Поле "email" должно быть валидным email-адресом',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (
  this: IUserModel,
  email: string,
  password: string,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        return user;
      });
    });
};

userSchema.set('toJSON', {
  transform(_doc, ret) {
    // eslint-disable-next-line no-param-reassign
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
