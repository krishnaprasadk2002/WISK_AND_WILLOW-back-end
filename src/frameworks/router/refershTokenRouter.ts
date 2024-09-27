import express from 'express';
import { refreshTokenMiddleware } from '../middlewares/refershTokenAuth';

const router = express.Router();

router.post('/', refreshTokenMiddleware)

export default router;
