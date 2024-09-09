// category.js

import { api } from './api';

function handleResponse(promise) {
  return promise
      .then(response => response.data.data) // 필요한 데이터만 추출
      .catch(error => {
        throw error; // 오류를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
      });
}

const CategoryAPI = {
  getCategoryList() {
    return handleResponse(api(true).get('/api/v1/categories/email'));
  },

  getCategory(categoryId) {
    return handleResponse(api(true).get(`/api/v1/categories/id/${categoryId}`));
  },

  createCategory(category) {
    return handleResponse(api(true).post('/api/v1/categories/create', category));
  },

  updateCategory(category) {
    return handleResponse(api(true).put('/api/v1/categories/update', category));
  },

  deleteCategory(categoryId) {
    return handleResponse(api(true).delete(`/api/v1/categories/delete/${categoryId}`));
  }
};

export default CategoryAPI;
