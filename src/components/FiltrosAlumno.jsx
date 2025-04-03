import React, { useState, useEffect } from 'react';
import { Button, Offcanvas, Form } from 'react-bootstrap';
import axios from 'axios';

const FiltrosAlumnos = ({ onFilterChange, showFilters, setShowFilters }) => {
    // Estados para los filtros
    const [filtroSexo, setFiltroSexo] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');
    const [filtroSituacionLaboral, setFiltroSituacionLaboral] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroEdad, setFiltroEdad] = useState([0, 100]);
    const [filtroPais, setFiltroPais] = useState('');
    const [filtroProvincia, setFiltroProvincia] = useState('');
    
    // Datos de países y provincias
    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);

    // Función para calcular la edad
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 0;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await axios.get('http://localhost:8080/paises');
                setPaises(response.data);
            } catch (error) {
                console.error('Error al obtener países:', error);
            }
        };
        fetchPaises();
    }, []);

    const fetchProvincias = async (paisId) => {
        try {
            const response = await axios.get(`http://localhost:8080/provincias/${paisId}`);
            setProvincias(response.data);
        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    };

    const handlePaisChange = (e) => {
        const selectedPais = e.target.value;
        setFiltroPais(selectedPais);
        setFiltroProvincia('');
        if (selectedPais) {
            fetchProvincias(selectedPais);
        } else {
            setProvincias([]);
        }
    };

    const handleProvinciaChange = (e) => {
        setFiltroProvincia(e.target.value);
    };

    const handleEdadChange = (e, index) => {
        const newFiltroEdad = [...filtroEdad];
        newFiltroEdad[index] = parseInt(e.target.value, 10) || 0;
        setFiltroEdad(newFiltroEdad);
    };

    const aplicarFiltros = () => {
        onFilterChange({
            sexo: filtroSexo,
            disponibilidad: filtroDisponibilidad,
            situacionLaboral: filtroSituacionLaboral,
            status: filtroStatus,
            edad: filtroEdad,
            pais: filtroPais,
            provincia: filtroProvincia,
            calcularEdad // Pasamos la función para que el componente padre pueda usarla
        });
    };

    return (
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
                                <option key={pais.id} value={pais.paisnombre}>
                                    {pais.paisnombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="filtroProvincia" className="mt-3">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Select 
                            value={filtroProvincia} 
                            onChange={handleProvinciaChange} 
                            disabled={!filtroPais}
                        >
                            <option value="">Todas</option>
                            {provincias.map((provincia) => (
                                <option key={provincia.id} value={provincia.estadonombre}>
                                    {provincia.estadonombre}
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
                                max="100"
                            />
                            <span>-</span>
                            <Form.Control
                                type="number"
                                value={filtroEdad[1]}
                                onChange={(e) => handleEdadChange(e, 1)}
                                min="0"
                                max="100"
                            />
                        </div>
                    </Form.Group>

                    <Button variant="primary" className="mt-4" onClick={aplicarFiltros}>
                        Aplicar Filtros
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FiltrosAlumnos;