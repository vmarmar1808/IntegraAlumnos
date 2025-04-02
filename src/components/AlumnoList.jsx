import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Row, Col, Accordion } from 'react-bootstrap';
import { getAlumnos, deleteAlumno } from '../services/AlumnoService';
import AlumnoDetailsModal from './AlumnoDetailsModal';
import AlumnoForm from './AlumnoForm';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AlumnoList = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');
    const [filtroSexo, setFiltroSexo] = useState('');
    const [filtroSituacion, setFiltroSituacion] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);



    useEffect(() => {
        const fetchAlumnos = async () => {
            const data = await getAlumnos();
            setAlumnos(data);
        };
        fetchAlumnos();
    }, []);

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


    // Filtrar alumnos según el término de búsqueda y los filtros seleccionados
    const filteredAlumnos = alumnos.filter(alumno => {
        return (
            (alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
             alumno.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
             alumno.telefono.includes(searchTerm)) &&
            (filtroDisponibilidad === '' || alumno.disponibilidad === filtroDisponibilidad) &&
            (filtroSexo === '' || alumno.sexo === filtroSexo) &&
            (filtroSituacion === '' || alumno.situacionLaboral === filtroSituacion) &&
            (filtroStatus === '' || alumno.status === filtroStatus)
        );
    });

    const exportAlumnos = (type) => {
        const alumnosData = [
            ["ID", "Nombre", "Apellidos", "DNI", "Email","Telefono","Direccion","Pais","Provincia","Propietario","Creado", "Sexo", "Situación Laboral", "Disponibilidad", "Estado", "Fecha Nacimiento"],
            ...alumnos.map(alumno => [
                alumno.id, alumno.nombre, alumno.apellidos, alumno.dni, alumno.email, alumno.telefono, alumno.direccion, alumno.pais, alumno.provincia, alumno.propietario, alumno.creado, alumno.sexo, alumno.situacionLaboral, alumno.disponibilidad, alumno.status, alumno.fechaNacimiento
            ])
        ];
    
        if (type === 'excel') {
            // Exportar a Excel
            const ws = XLSX.utils.aoa_to_sheet(alumnosData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Alumnos");
            XLSX.writeFile(wb, "Alumnos.xlsx");
        } else if (type === 'pdf') {
            // Exportar a PDF en modo horizontal
            const doc = new jsPDF('landscape'); // Cambiamos a modo horizontal
            doc.setFontSize(18);
            doc.text("Listado de Alumnos", 14, 15);
        
            // Usamos autoTable para crear una tabla en el PDF
            doc.autoTable({
                head: [alumnosData[0]], // Cabecera de la tabla
                body: alumnosData.slice(1), // Cuerpo de la tabla
                startY: 20, // Ajustamos el inicio de la tabla
                theme: 'grid',
                styles: {
                    fontSize: 7, // Reducimos el tamaño de la fuente para que quepa más contenido
                    cellPadding: 2, // Ajustamos el relleno de las celdas
                },
                headStyles: {
                    fillColor: [22, 160, 133], // Color de fondo para la cabecera
                    textColor: [255, 255, 255], // Color del texto en la cabecera
                },
                columnStyles: {
                    0: { cellWidth: 20 }, // Ajustamos el ancho de la primera columna (ID)
                    // Puedes ajustar otras columnas si es necesario
                },
            });
        
            // Descargar el PDF
            doc.save("Alumnos.pdf");
        }
    };
    

    return (
        <div>
            <h1 className="text-center">Lista de Alumnos</h1>
            <br /><br />
            <Button variant="primary" onClick={handleAdd}>Añadir Alumno</Button>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Exportar Datos</Accordion.Header>
                    <Accordion.Body>
                        <Button variant="primary" onClick={() => exportAlumnos('excel')}>
                            Exportar a Excel
                        </Button>
                        <br />
                        <Button variant="secondary" onClick={() => exportAlumnos('pdf')}>
                            Exportar a PDF
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <hr />

            {/* Búsqueda y filtros */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, apellidos o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-75"
                    />
                </Col>
                <Col md={6}>
                    <Row>
                        <Col>
                            <Form.Select value={filtroDisponibilidad} onChange={(e) => setFiltroDisponibilidad(e.target.value)}>
                                <option value="">Disponibilidad</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
                                <option value="">Sexo</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select value={filtroSituacion} onChange={(e) => setFiltroSituacion(e.target.value)}>
                                <option value="">Situación Laboral</option>
                                <option value="Desempleado">Desempleado</option>
                                <option value="ocupado">Ocupado</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                                <option value="">Estado</option>
                                <option value="cliente">Cliente</option>
                                <option value="en_oportunidad">En Oportunidad</option>
                                <option value="lead_caliente">Lead Caliente</option>
                                <option value="lead_frio">Lead Frío</option>
                                <option value="lead_templado">Lead Templado</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
            </Row>

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




