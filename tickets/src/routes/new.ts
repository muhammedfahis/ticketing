import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, validateRequest } from '@fayisorg/common';
import { body } from 'express-validator';

import { Ticket } from '../models/tickets';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';



const router = express.Router();

router.post('/api/tickets',requireAuth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be valid')
],validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({title,price,userId:req.currentUser!.id})
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.status(201).send(ticket);
});


export { router as createTicketRouter };