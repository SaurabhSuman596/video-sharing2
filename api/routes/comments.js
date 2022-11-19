import express from 'express';
import { addComment, deleteComment } from '../controllers/comments';
import verifyToken from '../verifyToken';

const router = express.Router();

router.post('/', verifyToken, addComment);
router.delete('/:id', verifyToken, deleteComment);
router.get('/:videoId', getComments);

export default router;
