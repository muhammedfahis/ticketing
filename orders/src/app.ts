import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@fayisorg/common';
import cookieSession from 'cookie-session';

import { orderCancelationRoute } from './routes/delete';
import { showOrderRoute } from './routes/show';
import { createOrderRoute } from './routes/new';
import { indexOrdersRoute } from './routes/index';




const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
)
app.use(currentUser);

app.use(orderCancelationRoute);
app.use(showOrderRoute);
app.use(createOrderRoute);
app.use(indexOrdersRoute);


app.all('*',() => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app };