import { NotFoundError, requireAuth, validateRequest,NotAuthroizedError, BadRequestError } from '@fayisorg/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';


const router = express.Router();


router.put('/api/tickets/:id',requireAuth,[
    body('title').not().isEmpty().withMessage('invalid title'),
    body('price').isFloat({gt: 0}).withMessage('invalid price')
],validateRequest, async (req:Request,res:Response) => {
    const { id } = req.params;
    const { title, price } = req.body;   
    const ticket = await Ticket.findById(id);
    if(!ticket) {
        throw new NotFoundError();
    }
    if(ticket.orderId) {
        throw new BadRequestError("can't updated a reserved ticket");
    }
    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }
    ticket.set({
        title,
        price
    })
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version
    })
    res.status(200).send(ticket);

})

export { router as UpdateTicketRouter }