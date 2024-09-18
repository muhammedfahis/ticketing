import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";

const OrderPage = ({ order, currentUser }) => {
    const [timer, setTimer ] = useState('');
    const { doRequest, error } = useRequest({
        method:'post',
        url:'/api/payments',
        body:{
            orderId: order.id,
            token:'sgas'
        },
        headers:{}
    })
    useEffect(() => {
        const timerLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimer(Math.round(msLeft/1000));
        }
        timerLeft();
       const timerId = setInterval(timerLeft,1000);
       return () => clearInterval(timerId)
    },[order])
    if(timer < 0) {
        return (
            <div>
                Sorry the order is expired
            </div>
        )
    }
    return (
        <div>
            <h1>Order Page</h1>
            <h2> Purchasing {order.ticket.title}</h2>
            <h4> you have {timer} seconds left</h4>
            <StripeCheckout
            token={({id}) => doRequest({token: id})}
            stripeKey="pk_test_51KejNuSDVCD4JzRqP4y2ZF7PxbTPJthWrl8iQljHT80dWUYCnW4AnglOtqKdZSte97vRQJQrB0xu3I65vPaq5bp100sdupp0gE"
            amount={order.ticket.price * 100}
            email={currentUser.email}
            />
        </div>
    )
}

OrderPage.getInitialProps = async(context,client) => {
    const { orderId } = context.query;
    console.log(orderId);
    
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data }
}

export default OrderPage;