import { Request, Response, NextFunction } from 'express';
import {
  listCards as listCardsRepo,
  createCard as createCardRepo,
  getCardById,
  deleteCard as deleteCardRepo,
  likeCard as likeCardRepo,
  unlikeCard as unlikeCardRepo,
} from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

type AuthedRequest = Request & { user?: { id?: string; _id?: string } };

const getUserId = (req: AuthedRequest): string => String(req.user?.id ?? req.user?._id ?? '');

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  listCardsRepo()
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const ownerId = getUserId(req);
  const { name, link } = req.body as { name?: string; link?: string };

  if (!ownerId) return next(new BadRequestError('Не найден идентификатор пользователя'));
  if (!name || !link) return next(new BadRequestError('Поля "name" и "link" обязательны'));

  createCardRepo(name, link, ownerId)
    .then((card) => res.status(201).send(card))
    .catch(next);
};

export const deleteCard = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return next(new BadRequestError('Не найден идентификатор пользователя'));

  getCardById(id)
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки по заданному id');
      if (card.owner_id !== userId) throw new ForbiddenError('Нельзя удалить чужую карточку');
      return deleteCardRepo(id, userId).then(() => res.send(card));
    })
    .catch(next);
};

const updateLike = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
  add: boolean,
) => {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return next(new BadRequestError('Не найден идентификатор пользователя'));

  (add ? likeCardRepo(id, userId) : unlikeCardRepo(id, userId))
    .then(() => getCardById(id))
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки по заданному id');
      res.send(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) =>
  updateLike(req as AuthedRequest, res, next, true);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) =>
  updateLike(req as AuthedRequest, res, next, false);
