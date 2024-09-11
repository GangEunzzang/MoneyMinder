import { api } from './api';

function handleResponse(promise) {
  return promise
  .then(response => response.data.data) // 필요한 데이터만 추출
  .catch(error => {
    throw error; // 오류를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
  });
}

export function getList(cursorId = null, categoryCode = '', startDate = '', endDate = '', memo = '') {
  return handleResponse(api(true).get('/api/v1/accountBook/search', {
    params: {
      cursorId: cursorId,
      categoryCode: categoryCode,
      startDate: startDate,
      endDate: endDate,
      memo: memo
    }
  }));
}


export function getById(accountBookId) {
  return handleResponse(api(true).get(`/api/v1/accountBook/id/${accountBookId}`));
}

export function create(accountBook) {
  return handleResponse(api(true).post('/api/v1/accountBook/create', accountBook));
  
}

export function update(accountBook) {
  return handleResponse(api(true).put('/api/v1/accountBook/update', accountBook));
}

export function deleteAccount(accountBookId) {
  return handleResponse(api(true).delete(`/api/v1/accountBook/delete/${accountBookId}`));
}

export default {
  getList,
  getById,
  create,
  update,
  deleteAccount
};
