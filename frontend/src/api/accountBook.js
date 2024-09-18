import {api} from './api';

function handleResponse(promise) {
    return promise
        .then(response => response.data.data) // 필요한 데이터만 추출
        .catch(error => {
            throw error; // 오류를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
        });
}

const AccountAPI = {

    getList(cursorId = null, categoryCode = '', startDate = '', endDate = '', memo = '') {
        return handleResponse(api(true).get('/api/v1/accountBook/search', {
            params: {
                cursorId: cursorId, categoryCode: categoryCode, startDate: startDate, endDate: endDate, memo: memo
            }
        }));
    },
    
    getById(accountBookId) {
        return handleResponse(api(true).get(`/api/v1/accountBook/id/${accountBookId}`));
    },

    create(accountBook) {
        return handleResponse(api(true).post('/api/v1/accountBook/create', accountBook));
    },

    update(accountBook) {
        return handleResponse(api(true).put('/api/v1/accountBook/update', accountBook));
    },

    deleteAccount(accountBookId) {
        return handleResponse(api(true).delete(`/api/v1/accountBook/delete/${accountBookId}`));
    },

    getMonthSummary(year, month) {
        return handleResponse(api(true).get(`/api/v1/accountBook/month-summary`, {
            params: {
                year: year, 
                month: month
            }
        }));
    },

    getYearSummary(year) {
        return handleResponse(api(true).get(`/api/v1/accountBook/year-summary`, {
            params: {
                year: year
            }
        }));
    },

    getAmountTotalByCategory(startDate, endDate) {
        return handleResponse(api(true).get(`/api/v1/accountBook/category-total`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        }))
    }
}

export default AccountAPI;
