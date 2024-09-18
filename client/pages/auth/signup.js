import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default function signUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, error } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        headers: {},
        onSuccess:() => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Password"/>
            </div>
            {error}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}