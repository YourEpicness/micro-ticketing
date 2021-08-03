import axios from "axios";

const buildClient = ({req}) => {
    // in k8s
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        // in the browser
        return axios.create({
            baseURL: '/'
        })
    }
}

export default buildClient;