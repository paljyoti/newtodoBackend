import express from 'express';
import { LoginUser, RegisterUser, logout } from '../Controllers/usercontroller.js';

const router = express.Router();

router.post('/register',RegisterUser);
router.post('/login', LoginUser)
router.post("/logout", logout)


export default router;