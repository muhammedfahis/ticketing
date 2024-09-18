import { NotAuthroizedError, NotFoundError, requireAuth } from '@fayisorg/common';
import express , { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';


const router = express.Router();


router.get('/api/orders/:orderId',requireAuth,[param('orderId').custom((input:string) => mongoose.Types.ObjectId.isValid(input)).withMessage('please give a valid id') ],async (req:Request,res:Response) => {
    const { orderId:id } = req.params;
    const order = await Order.findById(id).populate('ticket');
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }
    res.send(order)
})



export { router as showOrderRoute }