import { NotFoundError, requireAuth, validateRequest } from '@fayisorg/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator'
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id',requireAuth,[
    ],validateRequest, async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if(!ticket) {
        throw new NotFoundError()
    }
    res.status(200).send(ticket);
});

router.get('/api/tickets',requireAuth,[
],validateRequest, async (req: Request, res: Response) => {

const tickets = await Ticket.find({})
if(!tickets.length) {
    throw new NotFoundError()
}
res.status(200).send(tickets);
});

export { router as getTicketRouter };