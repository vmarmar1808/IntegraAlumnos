import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { addAlumno, updateAlumno, getAlumnos } from '../services/AlumnoService';
import axios from 'axios';

const AlumnoForm = ({ show, onHide, alumno, setAlumnos }) => {
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
        creado: '',
        situacionLaboral: '',
        status: ''
    });

    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        // Cargar países al cargar el formulario
        const fetchPaises = async () => {
            try {
                const response = await axios.get('http://localhost:8080/paises'); // Cambia la URL según tu backend
                setPaises(response.data);
            } catch (error) {
                console.error('Error al cargar países:', error);
            }
        };

        fetchPaises();

        if (alumno) {
            setFormData({
                nombre: alumno.nombre,
                apellidos: alumno.apellidos,
                email: alumno.email,
                telefono: alumno.telefono,
                direccion: alumno.direccion,
                codigoPostal: alumno.codigoPostal,
                fechaNacimiento: alumno.fechaNacimiento,
                dni: alumno.dni,
                pais: alumno.pais,
                provincia: alumno.provincia,
                sexo: alumno.sexo,
                disponibilidad: alumno.disponibilidad,
                propietario: alumno.propietario,
                creado: alumno.creado,
                situacionLaboral: alumno.situacionLaboral,
                status: alumno.status
            });

            // Cargar provincias del país seleccionado
            if (alumno.pais) {
                fetchProvincias(alumno.pais);
            }
        } else {
            // Si no hay un alumno seleccionado (añadir nuevo), reseteamos los campos
            setFormData({
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
                creado: '',
                situacionLaboral: '',
                status: ''
            });
        }
    }, [alumno]);

    const fetchProvincias = async (paisId) => {
        try {
            console.log('Cargando provincias para el país con ID:', paisId); // Depuración
            const response = await axios.get(`http://localhost:8080/provincias/${paisId}`);
            console.log('Provincias obtenidas:', response.data); // Depuración
            setProvincias(response.data);
        } catch (error) {
            console.error('Error al cargar provincias:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // Si se selecciona un país, cargar las provincias correspondientes
        if (name === 'pais') {
            setFormData({ ...formData, pais: value, provincia: '' }); // Reiniciar provincia
            fetchProvincias(value); // Pasar el ID del país
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (alumno) {
            await updateAlumno(alumno.id, formData);
        } else {
            await addAlumno(formData);
        }
        setAlumnos(await getAlumnos());
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{alumno ? 'Editar Alumno' : 'Añadir Alumno'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formApellidos">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formTelefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDireccion">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCodigoPostal">
                        <Form.Label>Código Postal</Form.Label>
                        <Form.Control
                            type="text"
                            name="codigoPostal"
                            value={formData.codigoPostal}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formFechaNacimiento">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formdni">
                        <Form.Label>DNI</Form.Label>
                        <Form.Control
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formPais">
                        <Form.Label>País</Form.Label>
                        <Form.Select
                            name="pais"
                            value={formData.pais}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un país</option>
                            {paises.map((pais) => (
                                <option key={pais.id} value={pais.id}> {/* Cambiar a pais.id */}
                                    {pais.paisnombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formProvincia">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Select
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleChange}
                            disabled={!formData.pais}
                            required
                        >
                            <option value="">Seleccione una provincia</option>
                            {provincias.map((provincia) => (
                                <option key={provincia.id} value={provincia.estadonombre}>
                                    {provincia.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formSexo">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Control
                            as="select"
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formDisponibilidad">
                        <Form.Label>Disponibilidad</Form.Label>
                        <Form.Control
                            as="select"
                            name="disponibilidad"
                            value={formData.disponibilidad}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un turno</option>
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formPropietario">
                        <Form.Label>Propietario</Form.Label>
                        <Form.Control
                            type="text"
                            name="propietario"
                            value={formData.propietario}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCreado">
                        <Form.Label>Fecha de Inscripción</Form.Label>
                        <Form.Control
                            type="date"
                            name="creado"
                            value={formData.creado}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formSituacionLaboral">
                        <Form.Label>Situación Laboral</Form.Label>
                        <Form.Control
                            as="select"
                            name="situacionLaboral"
                            value={formData.situacionLaboral}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Desempleado">Desempleado</option>
                            <option value="Ocupado">Ocupado</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un estado</option>
                            <option value="lead_caliente">Lead caliente</option>
                            <option value="lead_templado">Lead templado</option>
                            <option value="lead_frio">Lead frio</option>
                            <option value="cliente">Cliente</option>
                            <option value="en_oportunidad">En oportunidad</option>
                        </Form.Control>
                    </Form.Group>

                    <hr />

                    <Button variant="primary" type="submit">
                        {alumno ? 'Actualizar' : 'Añadir'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AlumnoForm;