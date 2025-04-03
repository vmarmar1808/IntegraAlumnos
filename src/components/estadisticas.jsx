import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAlumnos } from '../services/AlumnoService';
import { Button } from 'react-bootstrap';
import FiltrosAlumnos from './FiltrosAlumno';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Estadisticas = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [, setFilteredAlumnos] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchAlumnos = async () => {
            const data = await getAlumnos();
            if (data && Array.isArray(data)) {
                setAlumnos(data);
                setFilteredAlumnos(data);
                prepareChartData(data);
            }
        };
        fetchAlumnos();
    }, []);

    const handleFilterChange = (newFilters) => {
        const filtered = alumnos.filter((alumno) => {
            const edad = newFilters.calcularEdad(alumno.fechaNacimiento);
            return (
                (newFilters.sexo === '' || alumno.sexo === newFilters.sexo) &&
                (newFilters.disponibilidad === '' || alumno.disponibilidad === newFilters.disponibilidad) &&
                (newFilters.situacionLaboral === '' || alumno.situacionLaboral === newFilters.situacionLaboral) &&
                (newFilters.status === '' || alumno.status === newFilters.status) &&
                (edad >= newFilters.edad[0] && edad <= newFilters.edad[1]) &&
                (newFilters.pais === '' || alumno.pais === newFilters.pais) &&
                (newFilters.provincia === '' || alumno.provincia === newFilters.provincia)
            );
        });
        setFilteredAlumnos(filtered);
        prepareChartData(filtered);
    };

    const prepareChartData = (data) => {
        const genderCounts = {
            Masculino: data.filter((alumno) => alumno.sexo === 'Masculino').length,
            Femenino: data.filter((alumno) => alumno.sexo === 'Femenino').length,
        };

        setChartData({
            labels: ['Masculino', 'Femenino'],
            datasets: [
                {
                    label: 'Cantidad de Alumnos',
                    data: [genderCounts.Masculino, genderCounts.Femenino],
                    backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                },
            ],
        });
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Estadísticas de Alumnos</h1>
            <Button 
                variant="primary" 
                onClick={() => setShowFilters(true)} 
                style={{ marginBottom: '20px' }}
            >
                &#9776; Filtros
            </Button>

            <FiltrosAlumnos 
                onFilterChange={handleFilterChange}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            <div style={{ marginTop: '20px' }}>
                {chartData.labels.length > 0 ? (
                    <Bar data={chartData} options={{ responsive: true }} />
                ) : (
                    <p>No hay datos disponibles para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default Estadisticas;