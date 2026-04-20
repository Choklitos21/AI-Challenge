import { Router } from 'express';
import { embeddingController } from '../controllers/embedding.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', embeddingController.process);
router.get('/history', embeddingController.history);

export default router;