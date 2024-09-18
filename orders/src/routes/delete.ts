import { NotAuthroizedError, NotFoundError, OrderStatus, requireAuth } from '@fayisorg/common';
import express , { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();


router.delete('/api/orders/:orderId',requireAuth,[param('orderId').custom((input:string) => mongoose.Types.ObjectId.isValid(input)).withMessage('please give a valid id') ],async  (req:Request,res:Response) => {
    const { orderId:id } = req.params;
    const order = await Order.findById(id).populate('ticket');
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }
    order.set({
        status: OrderStatus.Cancelled
    })
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id:order.id,
        version: order.version,
        ticket:{
            id:order.ticket.id
        }
    })
    res.status(204).send(order);
})



export { router as orderCancelationRoute }