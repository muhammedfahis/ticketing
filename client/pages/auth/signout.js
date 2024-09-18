import useRequest from "../../hooks/use-request";
import { useEffect } from "react";
import Router from 'next/router';


export default function Signout() {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        headers: {}, 
        body:{}, // you can add any headers you need here.
        onSuccess: () => Router.push('/'),
    });

    useEffect(() => {
        doRequest();
    }, []);

    return (
        <div>Signing out...</div>
    );
}