// NasabioDasbohard/frontend/src/components/TopKeywordsChart.js (Versión final)

import React, { useEffect, useState } from 'react';
// Cambio aquí para importar la función renombrada
import { getTopKeywordsData } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopKeywordsChart() {
const [chartData, setChartData] = useState(null);

useEffect(() => {
    const fetchData = async () => {
    try {
        // Y cambio aquí para llamar a la función renombrada
        const response = await getTopKeywordsData();
        const topData = response.data.slice(0, 10);
        const data = {
        labels: topData.map(item => item.text),
        datasets: [{
            label: 'Frecuencia de Aparición',
            data: topData.map(item => item.value),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
        };
        setChartData(data);
    } catch (error) {
        console.error("Error al cargar datos para la gráfica:", error);
    }
    };
    fetchData();
}, []);

if (!chartData) {
    return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center" style={{ height: '400px', width: '100%' }}>
        <p className="text-gray-500">Cargando gráfica...</p>
    </div>
    );
}

const options = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Top 10 Temas de Investigación' } } };

return (
    <div className="bg-white p-4 rounded-lg shadow-md">
    <Bar data={chartData} options={options} />
    </div>
);
}
export default TopKeywordsChart;