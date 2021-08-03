import styles from '../styles/Landing.module.scss'
import axios from 'axios';
import buildClient from '../api/build-client';
import BaseLayout from '../components/layout/BaseLayout';

const Landing = ({currentUser}) => {
    console.log(currentUser);
    return <BaseLayout currentUser={currentUser.currentUser}>
        {currentUser.currentUser ? <h1 className={styles.title}> You are signed in </h1> : <h1 className={styles.title}> You are NOT signed in </h1>}
    </BaseLayout> 

};

// gets any data from the server on start/request
// not a component, so can't use hooks
export const getServerSideProps = async (context) => {
    // const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
    // {
    //     headers: req.headers
    // }).catch(err => console.log(err.message));

    
    // return {
    //     props: {
    //         currentUser: response.data
    //     }
    // };
    const client = buildClient(context);

    const {data} = await client.get('/api/users/currentuser').catch(err => console.log(err.message));;
    return {props: {currentUser: data}}
};

export default Landing;