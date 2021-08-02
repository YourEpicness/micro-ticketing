import styles from '../../styles/Form.module.scss';
import { useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';

const SignUp = () => {
    const [email, setEmail] = useState("");;
    const [password, setPassword] = useState("");
    const { doRequest, errors} = useRequest({
        url: '/api/users/signup',
        method:'post',
        body: {
            email, password
        }
    })
    
    const onSubmit = async (event) => {
        event.preventDefault();
        
        doRequest();
    }

    return (
        <div className={styles.form}>
             <form className={styles.container} onSubmit={onSubmit}>
                <h1 className={styles.title}> Sign Up </h1>
                <div className={styles['form-group']}>
                    <label> Email Address</label>
                    <input className={styles['form-input']} 
                        value={email}
                        onChange={e => setEmail(e.target.value)}

                    />
                </div>
                <div className={styles['form-group']}>
                    <label> Password</label>
                    <input type="password" className={styles['form-input']} 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {errors}
                <button className={styles['btn-primary']}>Sign Up</button>
            </form>
        </div>
       
    )
}

export default SignUp;