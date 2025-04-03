import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAlumnos } from '../services/AlumnoService';
import { Button, Offcanvas, Form } from 'react-bootstrap';
import axios from 'axios';

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
    const [filtroEdad, setFiltroEdad] = useState([0, 1000]); // Rango de edad
    const [filtroPais, setFiltroPais] = useState('');
    const [filtroProvincia, setFiltroProvincia] = useState('');

    // Datos de países y provincias
    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);

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

        const fetchPaises = async () => {
            try {
                const response = await axios.get('http://localhost:8080/paises');
                setPaises(response.data);
            } catch (error) {
                console.error('Error al obtener países:', error);
            }
        };

        fetchAlumnos();
        fetchPaises();
    }, []);

    const fetchProvincias = async (paisId) => {
        try {
            console.log('Cargando provincias para el país con ID:', paisId); // Depuración
            const response = await axios.get(`http://localhost:8080/provincias/${paisId}`);
            console.log('Provincias obtenidas:', response.data); // Depuración
            setProvincias(response.data);
        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    };

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
                (edad >= filtroEdad[0] && edad <= filtroEdad[1]) &&
                (filtroPais === '' || alumno.pais === filtroPais) &&
                (filtroProvincia === '' || alumno.provincia === filtroProvincia)
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

    const handlePaisChange = (e) => {
        const selectedPais = e.target.value; // Esto será el ID del país (número)
        setFiltroPais(selectedPais);
        setFiltroProvincia(''); // Reiniciar la provincia al cambiar el país
        if (selectedPais) {
            fetchProvincias(selectedPais); // Pasar el ID del país
        } else {
            setProvincias([]);
        }
        applyFilters(); // Aplicar filtros automáticamente
    };

    const handleProvinciaChange = (e) => {
        setFiltroProvincia(e.target.value);
        applyFilters(); // Aplicar filtros automáticamente
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
                        <Form.Group controlId="filtroPais" className="mt-3">
                            <Form.Label>País</Form.Label>
                            <Form.Select value={filtroPais} onChange={handlePaisChange}>
                                <option value="">Todos</option>
                                {paises.map((pais) => (
                                    <option key={pais.id} value={pais.id}> {/* Cambiar a pais.id */}
                                        {pais.paisnombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroProvincia" className="mt-3">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Select value={filtroProvincia} onChange={handleProvinciaChange} disabled={!filtroPais}>
                                <option value="">Todas</option>
                                {provincias.map((provincia) => (
                                    <option key={provincia.id} value={provincia.nombre}>
                                        {provincia.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="filtroSexo" className="mt-3">
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