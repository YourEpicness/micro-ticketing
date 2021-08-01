import express from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    // logic from current-user middleware and we just send the payload
    res.send({currentUser: req.currentUser || null});
})

export {router as currentUserRouter}