import  express, { Request, Response,  } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotAuthroizedError, NotFoundError, OrderStatus } from '@fayisorg/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import Stripe from 'stripe';

const router = express.Router();

router.post('/api/payments',requireAuth,[
    body('token')
    .not()
    .isEmpty()
    .withMessage('Token must be provided'),
    body('orderId')
    .not()
    .isEmpty()
    .withMessage('orderid must be provided')
],validateRequest,async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }
    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Order is cancelled');
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: order.price * 100,
            currency: 'usd',
            payment_method_data: {
              type: 'card' as Stripe.PaymentIntentCreateParams.PaymentMethodData.Type,
              
            },
            confirmation_method: 'automatic',
            confirm: true,
          });
          console.log(paymentIntent,'paymentIndt');
          
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id:'fadsgafsg',
            orderId: order.id,
            stripeId: 'asfgasgsgfa'
        })
          
        res.status(201).send(paymentIntent);
        
    } catch (error:any) {
        console.log(error);
        throw new BadRequestError(error.message)
        
    }

});

export { router as createChargeRouter };