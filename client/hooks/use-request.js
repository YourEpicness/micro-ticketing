import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/Form.module.scss'

const useRequest = ({ url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url,body);

            if(onSuccess) {
                onSuccess(response.data)
            }

            return response.data;
        } catch(err) {
            setErrors(

                <div className={styles.alert}>
                    <h4>Oooops....</h4>
                    <ul className={styles['my-0']}>
                        {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            );

            throw err;
        }
    }

    return {doRequest, errors}
}

export default useRequest;