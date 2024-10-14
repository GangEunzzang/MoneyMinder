import { api } from './api';

function handleResponse(promise) {
    return promise
        .then(response => response.data.data)
        .catch(error => {
            throw error;
        });
}

const UserAPI = {
    login(loginData) {
        return handleResponse(api(false).post('/api/v1/user/login', loginData));
    },

    signup(signupData) {
        return handleResponse(api(false).post('/api/v1/user/signup', signupData));
    }
};

export default UserAPI;
