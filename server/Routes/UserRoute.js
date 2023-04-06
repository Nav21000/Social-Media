import express from 'express';
import {getUser,getAllUsers,updateUser,deleteUser,followUser,unFollowUser} from '../Controllers/UserController.js';

const router = express.Router();

router.get('/:id',getUser);
router.get('/',getAllUsers);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);
router.put('/:id/follow',followUser);
router.put('/:id/unfollow',unFollowUser);

export default router;