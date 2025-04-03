import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Row, Col, Accordion } from 'react-bootstrap';
import { getAlumnos, deleteAlumno } from '../services/AlumnoService';
import AlumnoDetailsModal from './AlumnoDetailsModal';
import AlumnoForm from './AlumnoForm';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import FiltrosAlumnos from './FiltrosAlumno';

const AlumnoList = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [filters, setFilters] = useState({
        sexo: '',
        disponibilidad: '',
        situacionLaboral: '',
        status: '',
        edad: [0, 100],
        pais: '',
        provincia: '',
        calcularEdad: null
    });

    useEffect(() => {
        const fetchAlumnos = async () => {
            const data = await getAlumnos();
            setAlumnos(data);
            setFilteredAlumnos(data);
        };
        fetchAlumnos();
    }, []);

    useEffect(() => {
        const filtered = alumnos.filter(alumno => {
            const matchesSearch = 
                alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumno.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumno.telefono.includes(searchTerm);
            
            if (!filters.calcularEdad) return matchesSearch;
            
            const edad = filters.calcularEdad(alumno.fechaNacimiento);
            const matchesFilters = 
                (filters.sexo === '' || alumno.sexo === filters.sexo) &&
                (filters.disponibilidad === '' || alumno.disponibilidad === filters.disponibilidad) &&
                (filters.situacionLaboral === '' || alumno.situacionLaboral === filters.situacionLaboral) &&
                (filters.status === '' || alumno.status === filters.status) &&
                (edad >= filters.edad[0] && edad <= filters.edad[1]) &&
                (filters.pais === '' || alumno.pais === filters.pais) &&
                (filters.provincia === '' || alumno.provincia === filters.provincia);
            
            return matchesSearch && matchesFilters;
        });
        
        setFilteredAlumnos(filtered);
    }, [alumnos, searchTerm, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
            await deleteAlumno(id);
            setAlumnos(alumnos.filter((alumno) => alumno.id !== id));
        }
    };

    const handleEdit = (alumno) => {
        setSelectedAlumno(alumno);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedAlumno(null);
        setShowForm(true);
    };

    const exportAlumnos = (type) => {
        const alumnosData = [
            ["ID", "Nombre", "Apellidos", "DNI", "Email","Telefono","Direccion","Pais","Provincia","Propietario","Creado", "Sexo", "Situación Laboral", "Disponibilidad", "Estado", "Fecha Nacimiento"],
            ...filteredAlumnos.map(alumno => [
                alumno.id, alumno.nombre, alumno.apellidos, alumno.dni, alumno.email, alumno.telefono, alumno.direccion, alumno.pais, alumno.provincia, alumno.propietario, alumno.creado, alumno.sexo, alumno.situacionLaboral, alumno.disponibilidad, alumno.status, alumno.fechaNacimiento
            ])
        ];
    
        if (type === 'excel') {
            const ws = XLSX.utils.aoa_to_sheet(alumnosData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Alumnos");
            XLSX.writeFile(wb, "Alumnos.xlsx");
        } else if (type === 'pdf') {
            const doc = new jsPDF('landscape');
            doc.setFontSize(18);
            doc.text("Listado de Alumnos", 14, 15);
        
            doc.autoTable({
                head: [alumnosData[0]],
                body: alumnosData.slice(1),
                startY: 20,
                theme: 'grid',
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [22, 160, 133],
                    textColor: [255, 255, 255],
                },
                columnStyles: {
                    0: { cellWidth: 20 },
                },
            });
        
            doc.save("Alumnos.pdf");
        }
    };

    return (
        <div>
            <h1 className="text-center">Lista de Alumnos</h1>
            <br /><br />
            <div className="d-flex align-items-center justify-content-between mb-3">
                <Button variant="success" onClick={handleAdd}>Añadir Alumno</Button>
                <Accordion className="ms-3" style={{ width: 'auto' }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Exportar a PDF o Excel</Accordion.Header>
                        <Accordion.Body>
                            <Button variant="primary" className="me-2" onClick={() => exportAlumnos('excel')}>
                                Exportar a Excel
                            </Button>
                            <Button variant="secondary" onClick={() => exportAlumnos('pdf')}>
                                Exportar a PDF
                            </Button>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <hr />

            {/* Búsqueda (se mantiene igual) */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, apellidos o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-100"
                    />
                </Col>

                <Col md={8} className="text-end">
                    <Button variant="primary" onClick={() => setShowFilters(true)}>
                        &#9776; Filtros Avanzados
                    </Button>
                </Col>
            </Row>

             

            {/* Componente de filtros avanzados */}
            <FiltrosAlumnos 
                onFilterChange={handleFilterChange}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            {/* Tabla de alumnos */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">Nombre</th>
                        <th className="text-center">Apellidos</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Teléfono</th>
                        <th className="text-center">Fecha de nacimiento</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAlumnos.map((alumno) => (
                        <tr key={alumno.id}>
                            <td>{alumno.nombre}</td>
                            <td>{alumno.apellidos}</td>
                            <td>{alumno.email}</td>
                            <td>{alumno.telefono}</td>
                            <td>{alumno.fechaNacimiento}</td>
                            <td>
                                <div className="d-flex justify-content-center gap-2">
                                    <Button variant="info" onClick={() => { setSelectedAlumno(alumno); setShowDetails(true); }}>
                                        Ver Detalles
                                    </Button>
                                    <Button variant="warning" onClick={() => handleEdit(alumno)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(alumno.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modales */}
            {showDetails && (
                <AlumnoDetailsModal
                    show={showDetails}
                    onHide={() => setShowDetails(false)}
                    alumno={selectedAlumno}
                />
            )}

            {showForm && (
                <AlumnoForm
                    show={showForm}
                    onHide={() => setShowForm(false)}
                    alumno={selectedAlumno}
                    setAlumnos={setAlumnos}
                />
            )}
        </div>
    );
};

export default AlumnoList;




