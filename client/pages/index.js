import axios from 'axios';
import buildClient from '../api/build-client';
import Link from 'next/link';

const landingPage = ({ currentUser, tickets }) => { 
    const ticketRow =  tickets && tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>View</Link>
                </td>
                <td>{ticket.price}</td>
            </tr>
        )
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>#</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    { ticketRow }
                </tbody>
            </table>
        </div>
    )
}

landingPage.getInitialProps = async ({ req }, client, currentUser) => {
    try {
        const { data } = await client.get('/api/tickets');
        return { tickets: data };
    } catch (error) {
        console.log(error);

    }
}

export default landingPage;