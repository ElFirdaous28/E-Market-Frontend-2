import api from './axios';

// Products
export const getSellerProducts = async (id) => {
  const { data } = await api.get(`/products/seller/${id}`);
  return data;
};

export const createSellerProduct = async (payload) => {
  const { data } = await api.post('/seller/products', payload);
  return data;
};

export const updateSellerProduct = async ({ id, ...payload }) => {
  const { data } = await api.put(`/seller/products/${id}`, payload);
  return data;
};

export const deleteSellerProduct = async (id) => {
  const { data } = await api.delete(`/seller/products/${id}`);
  return data;
};

// Orders (read only for seller)
export const getSellerOrders = async () => {
  const { data } = await api.get('/seller/orders');
  return data;
};

// Coupons
export const getSellerCoupons = async () => {
  const { data } = await api.get('/seller/coupons');
  return data;
};

export const createSellerCoupon = async (payload) => {
  const { data } = await api.post('/seller/coupons', payload);
  return data;
};

export const updateSellerCoupon = async ({ id, ...payload }) => {
  const { data } = await api.put(`/seller/coupons/${id}`, payload);
  return data;
};

export const deleteSellerCoupon = async (id) => {
  const { data } = await api.delete(`/seller/coupons/${id}`);
  return data;
};
