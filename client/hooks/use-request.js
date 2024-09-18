import axios from 'axios';
import { useState } from 'react';


export default function useRequest  ({ url, method, body, headers,onSuccess }) {
    const [error, setError] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setError(null);
            const res = await axios[method](url, { ...body, ...props }, { headers });
            if(onSuccess) {
                console.log(res.data);
                
                onSuccess(res.data);
            }
            return res.data;
            
         } catch (err) {
            console.log(err);
            
             setError(
                <div className='alert alert-danger' role='alert'>
                <h4>Ooops...</h4>
                <ul className='my-0'>
                {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
                </ul>
            </div> 
             );
         }
    }

    return { doRequest, error };
    

}