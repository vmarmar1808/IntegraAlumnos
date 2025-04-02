import React, { useEffect, useState } from 'react';
import { Bar} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getAlumnos } from '../services/AlumnoService';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Estadisticas = () => {
    const [genderData, setGenderData] = useState({
        labels: [],
        datasets: [],
    });
    const [jobStatusData, setJobStatusData] = useState({
        labels: [],
        datasets: [],
    });
    const [availabilityData, setAvailabilityData] = useState({
        labels: [],
        datasets: [],
    });
    const [statusData, setStatusData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchAlumnos = async () => {
            const data = await getAlumnos();
            if (data && Array.isArray(data)) {
                prepareChartData(data);
            } else {
                console.error('No se recibieron datos válidos de la API');
            }
        };
        fetchAlumnos();
    }, []);

    const prepareChartData = (data) => {
        if (!data || !Array.isArray(data)) {
            console.error('Datos inválidos para preparar los gráficos');
            return;
        }

        // Estadísticas de Género
        const maleCount = data.filter(alumno => alumno.sexo === 'Masculino').length;
        const femaleCount = data.filter(alumno => alumno.sexo === 'Femenino').length;

        setGenderData({
            labels: ['Hombres', 'Mujeres'],
            datasets: [
                {
                    label: 'Cantidad de Alumnos',
                    data: [maleCount, femaleCount],
                    backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                },
            ],
        });

        // Situación Laboral
        const unemployedCount = data.filter(alumno => alumno.situacionLaboral === 'Desempleado').length;
        const employedCount = data.filter(alumno => alumno.situacionLaboral === 'ocupado').length;

        setJobStatusData({
            labels: ['Desempleado', 'Ocupado'],
            datasets: [
                {
                    label: 'Situación Laboral',
                    data: [unemployedCount, employedCount],
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                },
            ],
        });

        // Disponibilidad (Mañana/Tarde)
        const morningCount = data.filter(alumno => alumno.disponibilidad === 'Mañana').length;
        const afternoonCount = data.filter(alumno => alumno.disponibilidad === 'Tarde').length;

        setAvailabilityData({
            labels: ['Mañana', 'Tarde'],
            datasets: [
                {
                    label: 'Disponibilidad',
                    data: [morningCount, afternoonCount],
                    backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                },
            ],
        });

        // Estado de los Alumnos (Status)
        const statusLabels = ['cliente', 'en_oportunidad', 'lead_caliente', 'lead_frio', 'lead_templado'];
        const statusCounts = statusLabels.map(status => data.filter(alumno => alumno.status === status).length);

        setStatusData({
            labels: statusLabels,
            datasets: [
                {
                    label: 'Estado de Alumnos',
                    data: statusCounts,
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                },
            ],
        });
    };    

    return (
                <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Estadísticas de Alumnos</h1>
            <br />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
                <div>
                    <h2>Estadísticas de Género</h2>
                    {genderData.labels.length > 0 ? (
                        <Bar data={genderData} options={{ responsive: true }} />
                    ) : (
                        <p>Cargando datos o no hay datos disponibles...</p>
                    )}
                </div>
                <div>
                    <h2>Situación Laboral</h2>
                    {jobStatusData.labels.length > 0 ? (
                        <Bar data={jobStatusData} options={{ responsive: true }} />
                    ) : (
                        <p>Cargando datos o no hay datos disponibles...</p>
                    )}
                </div>
                <div>
                    <h2>Disponibilidad</h2>
                    {availabilityData.labels.length > 0 ? (
                        <Bar data={availabilityData} options={{ responsive: true }} />
                    ) : (
                        <p>Cargando datos o no hay datos disponibles...</p>
                    )}
                </div>
                <div>
                    <h2>Estado de los Alumnos</h2>
                    {statusData.labels.length > 0 ? (
                        <Bar data={statusData} options={{ responsive: true }} />
                    ) : (
                        <p>Cargando datos o no hay datos disponibles...</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Estadisticas;