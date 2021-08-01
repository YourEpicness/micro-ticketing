import express from 'express';

const router = express.Router();

// signing out means remove information from cookie including JWT
router.post('/api/users/signout', (req, res) => {
    req.session = null;

    res.send({});

})

export {router as signoutRouter}