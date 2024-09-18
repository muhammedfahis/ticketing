import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@fayisorg/common';
import cookieSession from 'cookie-session';

import { createTicketRouter } from './routes/new';
import { getTicketRouter } from './routes/show';
import { UpdateTicketRouter } from './routes/update';


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
app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(UpdateTicketRouter);



app.all('*',() => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app };