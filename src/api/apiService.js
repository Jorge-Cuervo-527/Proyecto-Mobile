import axios from 'axios';

// Configuración principal de Axios
const API = axios.create({
    baseURL: 'https://mi-backend-wy1n.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// CRUD DE DIRECTORES
export const getDirectores = () => API.get('/director');
export const getDirectorById = (id) => API.get(`/director/${id}`);
export const createDirector = (director) => API.post('/director', director);
export const updateDirector = (id, director) => API.put(`/director/${id}`, director);

// CRUD DE GÉNEROS
export const getGeneros = () => API.get('/genero');
export const getGeneroById = (id) => API.get(`/genero/${id}`);
export const createGenero = (genero) => API.post('/genero', genero);
export const updateGenero = (id, genero) => API.put(`/genero/${id}`, genero);

// CRUD DE MEDIA (Películas y Series)
export const getMedia = () => API.get('/media');
export const getMediaById = (id) => API.get(`/media/${id}`);
export const createMedia = (media) => API.post('/media', media);
export const updateMedia = (id, media) => API.put(`/media/${id}`, media);
export const deleteMedia = (id) => API.delete(`/media/${id}`);

// CRUD DE PRODUCTORAS
export const getProductoras = () => API.get('/productora');
export const getProductoraById = (id) => API.get(`/productora/${id}`);
export const createProductora = (productora) => API.post('/productora', productora);
export const updateProductora = (id, productora) => API.put(`/productora/${id}`, productora);

// CRUD DE TIPOS
export const getTipos = () => API.get('/tipo');
export const getTipoById = (id) => API.get(`/tipo/${id}`);
export const createTipo = (tipo) => API.post('/tipo', tipo);
export const updateTipo = (id, tipo) => API.put(`/tipo/${id}`, tipo);