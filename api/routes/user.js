import express from 'express';
import verifyToken from '../verifyToken';
import {
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  update,
} from '../controllers/user';

const router = express.Router();

// Update User

router.put('/:id', verifyToken, update);

// delete user

router.delete('/:id', verifyToken, deleteUser);

// Get a User

router.get('/:id', getUser);

// Subscribe a user

router.put('/sub/:id', verifyToken, subscribe);

// unsubscribe a user

router.put('/unsub/:id', verifyToken, unsubscribe);

export default router;
