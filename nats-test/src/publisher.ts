import nats, { Stan } from 'node-nats-streaming';
import { Subjects } from './events/subjects';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();
const client = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222'
})
client.on('connect', async () => {
    console.log('connected to nats publisher');

    let data = {
        id: '123',
        title:'test',
        price:20
    }
  try {
    await new TicketCreatedPublisher(client).publish(data)
  } catch(err) {
    console.log(err);
    
  }
})

