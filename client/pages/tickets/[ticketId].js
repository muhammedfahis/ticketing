import Router from "next/router";
import useRequest from "../../hooks/use-request";


const ShowTicket = ({ currentUser, ticket}) => {
    console.log(ticket,'ticket');
    
    const { doRequest, error } = useRequest({
        method:'post',
        url:'/api/orders',
        body: {
            ticketId: ticket.id
        },
        headers:{},
        onSuccess:(order) => Router.push(`/orders/${order.id}`)
        
    })
    const click = (event) => {
        doRequest();
    }
 
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h3>{ticket.price}</h3>
            <button className="btn btn-primary" onClick={click}>Purchase</button>
            {error}
        </div>
    )
}

ShowTicket.getInitialProps = async (context,client) => {
    const { ticketId } = context.query;
    console.log(ticketId);
    
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data }
}

export default ShowTicket;