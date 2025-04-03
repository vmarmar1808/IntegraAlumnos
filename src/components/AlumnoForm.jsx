import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { addAlumno, updateAlumno, getAlumnos } from '../services/AlumnoService';
import axios from 'axios';


const AlumnoForm = ({ show, onHide, alumno, setAlumnos }) => {
    // Estado del formulario con nombres exactos de la BD
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        codigoPostal: '',
        fechaNacimiento: '',
        dni: '',
        pais: '',
        provincia: '',
        sexo: '',
        disponibilidad: '',
        propietario: '',
        creado: new Date().toISOString().split('T')[0],
        situacionLaboral: '',
        status: ''
    });

    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [loadingProvincias, setLoadingProvincias] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar países y datos del alumno
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar países
                const paisesResponse = await axios.get('http://localhost:8080/paises');
                setPaises(paisesResponse.data);

                if (alumno) {
                    console.log('Datos del alumno recibidos:', alumno); // Depuración

                    // Formatear datos del alumno para el formulario
                    const initialData = {
                        nombre: alumno.nombre || '',
                        apellidos: alumno.apellidos || '',
                        email: alumno.email || '',
                        telefono: alumno.telefono || '',
                        direccion: alumno.direccion || '',
                        codigoPostal: alumno.codigoPostal !== null && alumno.codigoPostal !== undefined
                            ? alumno.codigoPostal.toString()
                            : '',
                        fechaNacimiento: alumno.fechaNacimiento
                            ? formatDateForInput(alumno.fechaNacimiento)
                            : '',
                        dni: alumno.dni || '',
                        pais: alumno.pais || '',
                        provincia: alumno.provincia || '',
                        sexo: alumno.sexo || '',
                        disponibilidad: alumno.disponibilidad || '',
                        propietario: alumno.propietario || '',
                        creado: alumno.creado
                            ? formatDateForInput(alumno.creado)
                            : new Date().toISOString().split('T')[0],
                        situacionLaboral: alumno.situacionLaboral || '',
                        status: alumno.status || ''
                    };

                    console.log('Datos iniciales del formulario:', initialData); // Depuración
                    setFormData(initialData);

                    // Cargar provincias si hay país seleccionado
                    if (alumno.pais) {
                        setLoadingProvincias(true);
                        const paisSeleccionado = paisesResponse.data.find(p => p.paisnombre === alumno.pais);
                        if (paisSeleccionado) {
                            const provinciasResponse = await axios.get(`http://localhost:8080/provincias/${paisSeleccionado.id}`);
                            setProvincias(provinciasResponse.data);
                        }
                        setLoadingProvincias(false);
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        if (show) {
            fetchData();
        }
    }, [alumno, show]);

    // Función para formatear fechas
    const formatDateForInput = (dateString) => {
        try {
            // Si ya está en formato YYYY-MM-DD, devolver directamente
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }

            // Si es una fecha ISO (con tiempo)
            if (dateString.includes('T')) {
                return dateString.split('T')[0];
            }

            // Si es una fecha en otro formato
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }

            return '';
        } catch (e) {
            console.error('Error formateando fecha:', e);
            return '';
        }
    };

    // Cargar provincias cuando cambia el país seleccionado
    const handlePaisChange = async (e) => {
        const paisNombre = e.target.value;
        setFormData(prev => ({
            ...prev,
            pais: paisNombre,
            provincia: ''
        }));

        if (paisNombre) {
            try {
                setLoadingProvincias(true);
                const paisSeleccionado = paises.find(p => p.paisnombre === paisNombre);
                if (paisSeleccionado) {
                    const response = await axios.get(`http://localhost:8080/provincias/${paisSeleccionado.id}`);
                    setProvincias(response.data);
                }
            } catch (error) {
                console.error('Error al cargar provincias:', error);
            } finally {
                setLoadingProvincias(false);
            }
        } else {
            setProvincias([]);
        }
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Usar los datos directamente (nombres ya coinciden con la BD)
            if (alumno) {
                await updateAlumno(alumno.id, formData);
            } else {
                await addAlumno(formData);
            }

            // Actualizar lista de alumnos y cerrar modal
            const updatedAlumnos = await getAlumnos();
            setAlumnos(updatedAlumnos);
            onHide();
        } catch (error) {
            console.error('Error al guardar el alumno:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{alumno ? 'Editar Alumno' : 'Añadir Alumno'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formApellidos">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formTelefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDireccion">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formCodigoPostal">
                                <Form.Label>Código Postal</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codigoPostal"
                                    value={formData.codigoPostal}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="formFechaNacimiento">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formdni">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPais">
                            <Form.Label>País</Form.Label>
                            <Form.Select
                                name="pais"
                                value={formData.pais}
                                onChange={handlePaisChange}
                                required
                            >
                                <option value="">Seleccione un país</option>
                                {paises.map((pais) => (
                                    <option key={pais.id} value={pais.paisnombre}>
                                        {pais.paisnombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formProvincia">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Select
                                name="provincia"
                                value={formData.provincia}
                                onChange={handleChange}
                                disabled={!formData.pais || loadingProvincias}
                                required
                            >
                                <option value="">Seleccione una provincia</option>
                                {loadingProvincias ? (
                                    <option>Cargando provincias...</option>
                                ) : (
                                    provincias.map((provincia) => (
                                        <option key={provincia.id} value={provincia.nombre}>
                                            {provincia.nombre}
                                        </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSexo">
                            <Form.Label>Sexo</Form.Label>
                            <Form.Select
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un sexo</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </Form.Select>
                        </Form.Group>
                    </div>


                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group className="mb-3" controlId="formDisponibilidad">
                                <Form.Label>Disponibilidad</Form.Label>
                                <Form.Select
                                    name="disponibilidad"
                                    value={formData.disponibilidad}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un turno</option>
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group className="mb-3" controlId="formSituacionLaboral">
                                <Form.Label>Situación Laboral</Form.Label>
                                <Form.Select
                                    name="situacionLaboral"
                                    value={formData.situacionLaboral}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Desempleado">Desempleado</option>
                                    <option value="ocupado">Ocupado</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group className="mb-3" controlId="formStatus">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un estado</option>
                                    <option value="lead_caliente">Lead caliente</option>
                                    <option value="lead_templado_">Lead templado</option>
                                    <option value="lead_frio">Lead frío</option>
                                    <option value="cliente">Cliente</option>
                                    <option value="en_oportunidad">En oportunidad</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formPropietario">
                                <Form.Label>Propietario</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="propietario"
                                    value={formData.propietario}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formCreado">
                                <Form.Label>Fecha de Inscripción</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="creado"
                                    value={formData.creado}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    {alumno ? 'Actualizando...' : 'Guardando...'}
                                </>
                            ) : (
                                alumno ? 'Actualizar' : 'Guardar'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AlumnoForm;