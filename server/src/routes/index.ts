import { Router } from "express";
import user from './user.route';
import auth from './auth.route'

const router = Router();

router.get('/healthcheck', (_, res) => res.send('Server is A-OK'))
router.use('/api/v1/users', user)
router.use('/api/v1/auth', auth)

export default router