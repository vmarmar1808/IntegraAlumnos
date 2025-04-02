import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAlumnos } from '../services/AlumnoService';
import { Button, Offcanvas, Form } from 'react-bootstrap';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Estadisticas = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [, setFilteredAlumnos] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filtros
    const [filtroSexo, setFiltroSexo] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');
    const [filtroSituacionLaboral, setFiltroSituacionLaboral] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroEdad, setFiltroEdad] = useState([0, 100]); 

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

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const applyFilters = () => {
        const filtered = alumnos.filter((alumno) => {
            const edad = calcularEdad(alumno.fechaNacimiento);
            return (
                (filtroSexo === '' || alumno.sexo === filtroSexo) &&
                (filtroDisponibilidad === '' || alumno.disponibilidad === filtroDisponibilidad) &&
                (filtroSituacionLaboral === '' || alumno.situacionLaboral === filtroSituacionLaboral) &&
                (filtroStatus === '' || alumno.status === filtroStatus) &&
                (edad >= filtroEdad[0] && edad <= filtroEdad[1])
            );
        });
        setFilteredAlumnos(filtered);
        prepareChartData(filtered);
        setShowFilters(false); 
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

    const handleEdadChange = (e, index) => {
        const newFiltroEdad = [...filtroEdad];
        newFiltroEdad[index] = parseInt(e.target.value, 10);
        setFiltroEdad(newFiltroEdad);
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Estadísticas de Alumnos</h1>
            <Button variant="primary" onClick={() => setShowFilters(true)} style={{ marginBottom: '20px' }}>
                &#9776; Filtros
            </Button>

            {/* Panel lateral de filtros */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filtros</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Group controlId="filtroSexo">
                            <Form.Label>Sexo</Form.Label>
                            <Form.Select value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroDisponibilidad" className="mt-3">
                            <Form.Label>Disponibilidad</Form.Label>
                            <Form.Select value={filtroDisponibilidad} onChange={(e) => setFiltroDisponibilidad(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroSituacionLaboral" className="mt-3">
                            <Form.Label>Situación Laboral</Form.Label>
                            <Form.Select value={filtroSituacionLaboral} onChange={(e) => setFiltroSituacionLaboral(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="Desempleado">Desempleado</option>
                                <option value="ocupado">Ocupado</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroStatus" className="mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="cliente">Cliente</option>
                                <option value="en_oportunidad">En Oportunidad</option>
                                <option value="lead_caliente">Lead Caliente</option>
                                <option value="lead_frio">Lead Frío</option>
                                <option value="lead_templado">Lead Templado</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroEdad" className="mt-3">
                            <Form.Label>Rango de Edad</Form.Label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Form.Control
                                    type="number"
                                    value={filtroEdad[0]}
                                    onChange={(e) => handleEdadChange(e, 0)}
                                    min="0"
                                    max="1000"
                                />
                                <span>-</span>
                                <Form.Control
                                    type="number"
                                    value={filtroEdad[1]}
                                    onChange={(e) => handleEdadChange(e, 1)}
                                    min="0"
                                    max="1000"
                                />
                            </div>
                        </Form.Group>

                        <Button variant="primary" className="mt-4" onClick={applyFilters}>
                            Aplicar Filtros
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Gráfico */}
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