import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
    const [ title , setTitle ] = useState('');
    const [ price, setPrice ] = useState(0)
    const { doRequest, error } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        headers: {},
        onSuccess:() => Router.push('/')
    });

    const onBlur = (event) => {
        const value = parseFloat(price);
        if(isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest();
    }

    return (
        <div className="container">
            <h1>Create Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-container" style={{ width: '30%' }}>
                    <div className="form-group mb-2 d-flex align-items-center justify-content-between">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control"/>
                    </div>
                    <div className="form-group mb-2 d-flex align-items-center justify-content-between">
                        <label>Price</label>
                        <input value={price} onBlur={onBlur} onChange={e => setPrice(e.target.value)} className="form-control" />
                    </div>
                    <button className="text-center btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
            {error}
        </div>
    )
}

export default NewTicket;