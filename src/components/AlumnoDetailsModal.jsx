import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlumnoDetailsModal = ({ show, onHide, alumno }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Alumno</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Nombre:</strong> {alumno.nombre}</p>
                <p><strong>Apellidos:</strong> {alumno.apellidos}</p>
                <p><strong>Email:</strong> {alumno.email}</p>
                <p><strong>Telefono:</strong> {alumno.telefono}</p>
                <p><strong>Dirección:</strong> {alumno.direccion}</p>
                <p><strong>Codigo Postal:</strong> {alumno.codigoPostal}</p>
                <p><strong>Fecha de Nacimiento:</strong> {alumno.fechaNacimiento}</p>
                <p><strong>DNI:</strong> {alumno.dni}</p>
                <p><strong>País:</strong> {alumno.pais}</p>
                <p><strong>Provincia:</strong> {alumno.provincia}</p>
                <p><strong>Sexo:</strong> {alumno.sexo}</p>
                <p><strong>Disponibilidad:</strong> {alumno.disponibilidad}</p>
                <p><strong>Propietario:</strong> {alumno.propietario}</p>
                <p><strong>Fecha de Inscripción:</strong> {alumno.creado}</p>
                <p><strong>Situación laboral:</strong> {alumno.situacionLaboral}</p>
                <p><strong>Status:</strong> {alumno.status}</p>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlumnoDetailsModal;


