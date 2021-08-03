import styles from '../../styles/Form.module.scss';
import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import BaseLayout from '../../components/layout/BaseLayout';
import buildClient from '../../api/build-client';

const SignIn = ({currentUser}) => {
    const [email, setEmail] = useState("");;
    const [password, setPassword] = useState("");
    const { doRequest, errors} = useRequest({
        url: '/api/users/SignIn',
        method:'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/'),
    })
    
    const onSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await doRequest();

            Router.push('/');
        } catch(err) {}
       
    }

    return (
        <BaseLayout currentUser={currentUser}>
            <div className={styles.form}>
                <form className={styles.container} onSubmit={onSubmit}>
                    <h1 className={styles.title}> Sign In </h1>
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
        </BaseLayout>
    )
}

export const getServerSideProps = async (context) => {

    const client = buildClient(context);

    const {data} = await client.get('/api/users/currentuser').catch(err => console.log(err.message));;
    return {props: {currentUser: data}}
};

export default SignIn;