import express, { Request , Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@fayisorg/common';
import { User } from '../models/user';
import { BadRequestError } from '@fayisorg/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
const router  = express.Router();


router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Please enter a valid password')
    ],
    validateRequest
    ,async (req:Request, res:Response) => {
    
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });  
    if(!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }
    const isPasswordMatch = await Password.compare(existingUser.password, password);  
    if(!isPasswordMatch) {

        throw new BadRequestError('Invalid credentials');
    }
    const token = jwt.sign({ email: existingUser.email, id: existingUser.id },process.env.JWT_KEY!);
    req.session = { jwt : token }
    res.status(200).send(existingUser);
});


export { router as signinRouter };
