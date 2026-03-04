const API_BASE_URL = 'http://localhost:7090/api';

const request = async (method, endpoint, data = null) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        let result = null;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            result = await response.json();
        }

        return { data: result };
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
};

const api = {
    get: (url) => request('GET', url),
    post: (url, data) => request('POST', url, data),
    put: (url, data) => request('PUT', url, data),
    delete: (url) => request('DELETE', url),
};

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Skills API
export const skillsAPI = {
    getAll: () => api.get('/skills'),
    create: (skill) => api.post('/skills', skill),
    delete: (id) => api.delete(`/skills/${id}`),
};

// Students API
export const studentsAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (student) => api.post('/students', student),
    update: (id, student) => api.put(`/students/${id}`, student),
    delete: (id) => api.delete(`/students/${id}`),
};

// Requirements API
export const requirementsAPI = {
    getAll: () => api.get('/requirements'),
    getOpen: () => api.get('/requirements/open'),
    getById: (id) => api.get(`/requirements/${id}`),
    create: (studentId, requirement) => api.post(`/requirements/${studentId}`, requirement),
    checkEligibility: (studentId, requirementId) =>
        api.get(`/requirements/check/${studentId}/${requirementId}`),
    getEligibleStudents: (requirementId) =>
        api.get(`/requirements/eligible-students/${requirementId}`),
    getEligibleRequirements: (studentId) =>
        api.get(`/requirements/eligible-for/${studentId}`),
    close: (id) => api.put(`/requirements/close/${id}`),
};

export default api;
