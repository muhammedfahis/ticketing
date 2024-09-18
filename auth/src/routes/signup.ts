import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@fayisorg/common';
import { validateRequest } from '@fayisorg/common';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router  = express.Router();

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .trim()
        .isLength({ min: 4 , max:10})
        .withMessage('Please enter a valid password')
],validateRequest,async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new BadRequestError('Email in use');
    } else {
        const user = User.build({ email, password });
        await user.save();
        const token = jwt.sign({ email: user.email, id: user.id },process.env.JWT_KEY!);
        req.session = { jwt : token }
        res.status(201).send(user);
    }
});


export { router as signupRouter };
