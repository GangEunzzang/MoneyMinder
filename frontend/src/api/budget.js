import { api } from './api';

function handleResponse(promise) {
    return promise
        .then(response => response.data.data)
        .catch(error => {
            throw error;
        });
}

const BudgetAPI = {
    getBudget(budgetId) {
        return handleResponse(api(true).get(`/api/v1/budget/id/${budgetId}`));
    },

    createBudget(budget) {
        return handleResponse(api(true).post('/api/v1/budget/create', budget));
    },

    updateBudget(budget) {
        return handleResponse(api(true).put('/api/v1/budget/update', budget));
    },

    deleteBudget(budgetId) {
        return handleResponse(api(true).delete(`/api/v1/budget/delete/${budgetId}`));
    },

    getList(categoryCode = '', year = '', month = '') {
        return handleResponse(api(true).get('/api/v1/budget/search', {
            params: {
                categoryCode: categoryCode,
                year: year,
                month: month
            }
        }));
    }
};

export default BudgetAPI;
