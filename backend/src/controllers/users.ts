import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  createUser as createUserRepo,
  findUserByCredentials,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../models/user';
import { JWT_SECRET } from '../config';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

type AuthedRequest = Request & { user?: { id?: string; _id?: string } };

const getUserId = (req: AuthedRequest): string => String(req.user?.id ?? req.user?._id ?? '');

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return next(new BadRequestError('Email и пароль обязательны'));

  return findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        })
        .send({ token });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, password, email } = req.body as {
    name?: string; about?: string; avatar?: string; password?: string; email?: string;
  };

  if (!email || !password) return next(new BadRequestError('Email и пароль обязательны'));

  return createUserRepo({ name, about, avatar, email, password })
    .then((data) => res.status(201).send(data))
    .catch((err: any) => {
      if (err?.code === '23505') {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else {
        next(err);
      }
    });
};

const sendUserOr404 = (id: string, res: Response, next: NextFunction) => {
  return getUserById(id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
      res.send(user);
    })
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  return sendUserOr404(String(req.params.id), res, next);
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req as AuthedRequest);
  return sendUserOr404(id, res, next);
};

export const updateUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req as AuthedRequest);
  const { name, about } = req.body as { name?: string; about?: string };

  if (!name || !about) return next(new BadRequestError('Поля "name" и "about" обязательны'));

  return updateProfile(id, name, about)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
      res.send(user);
    })
    .catch(next);
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req as AuthedRequest);
  const { avatar } = req.body as { avatar?: string };

  if (!avatar) return next(new BadRequestError('Поле "avatar" обязательно'));

  return updateAvatar(id, avatar)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
      res.send(user);
    })
    .catch(next);
};
