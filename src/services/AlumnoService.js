import axios from 'axios';

const API_URL = 'http://localhost:8080/alumnos'; // Asegúrate de que este sea el URL de tu backend

export const getAlumnos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
    }
};

export const addAlumno = async (alumno) => {
    try {
        const response = await axios.post(API_URL, alumno);
        return response.data;
    } catch (error) {
        console.error('Error al agregar alumno:', error);
    }
};

export const updateAlumno = async (id, alumno) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, alumno);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
    }
};

export const deleteAlumno = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
    }
};
