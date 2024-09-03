import { api } from './api';

function handleResponse(promise) {
  return promise
      .then(response => response.data.data) // 필요한 데이터만 추출
      .catch(error => {
        throw error; // 오류를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
      });
}

export function getCategoryList() {
  return handleResponse(api(true).get('/api/v1/categories/email'));
}

export function getCategory(categoryId) {
  return handleResponse(api(true).get(`/api/v1/categories/id/${categoryId}`));
}

export function createCategory(category) {
  return handleResponse(api(true).post('/api/v1/categories/create', category));
}

export function updateCategory(category) {
  return handleResponse(api(true).put('/api/v1/categories/update', category));
}

export function deleteCategory(categoryId) {
  return handleResponse(api(true).delete(`/api/v1/categories/delete/${categoryId}`));
}

export default {
  getCategoryList,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
