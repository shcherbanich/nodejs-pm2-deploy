import {
  Router, Request, Response, NextFunction,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import NotFoundError from '../errors/not-found-error';
import {
  createUser, login,
} from '../controllers/users';
import { validateUserBody, validateAuthentication } from '../middlewares/validatons';

const router = Router();
// crash-test endpoint — сервер падает и автоматически перезапускается pm2
router.get('/crash-test', (req: Request, res: Response) => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
  res.status(200).send({ message: 'Проверяем автоматический рестарт pm2' });
});

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

// все роуты, кроме /signin и /signup, защищены авторизацией;
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
