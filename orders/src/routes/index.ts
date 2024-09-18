import { requireAuth } from '@fayisorg/common';
import express , { Request, Response } from 'express';
import { Order } from '../models/order';


const router = express.Router();


router.get('/orders', requireAuth, async (req:Request,res:Response) => {
    let { id:userId  } =  req.currentUser!
    let orders = await Order.find({ userId }).populate('ticket');
    res.send(orders);
})



export { router as indexOrdersRoute }