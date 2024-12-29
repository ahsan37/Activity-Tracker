import {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 


export default function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await fetch('/api/logs');
                const data = await response.json();
                setLogs(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLogs();
    }, []);

}