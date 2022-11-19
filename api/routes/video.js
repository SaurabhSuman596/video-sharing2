import express from 'express';
import {
  addVideo,
  addView,
  deleteVideo,
  dislike,
  getByTag,
  getVideo,
  like,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from '../controllers/video';
import verifyToken from '../verifyToken';

const router = express.Router();

router.post('/', verifyToken, addVideo);
router.put('/:id', verifyToken, updateVideo);
router.delete('/:id', verifyToken, deleteVideo);
router.get('/find/:id', getVideo);
router.put('/:id/view', addView);
router.get('/random', random);
router.get('/trend', trend);
router.get('/sub', verifyToken, sub);
router.get('/tag', getByTag);
router.get('/search', search);
router.put('/likes/:id', verifyToken, like);
router.put('/dislike/:id', dislike);

export default router;
