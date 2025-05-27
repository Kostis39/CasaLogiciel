import useSWR from 'swr';

const API_URL = 'http://localhost:5000';
const USE_MOCK = true;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const isAlreadyEntered = (id: number) => {
    if (USE_MOCK) {
        return true;
    }else {
        const { data, error } = useSWR(`${API_URL}/grimpeurs/seance/${id}`, fetcher);
        return error.status === 404 ? false : data.est_la;
    }
};