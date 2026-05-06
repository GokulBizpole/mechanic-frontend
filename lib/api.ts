import { getToken } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// --- Public ---
export const getServices = () => request('/api/services');
export const createBooking = (body: object) => request('/api/bookings', { method: 'POST', body: JSON.stringify(body) });
export const getBookingStatus = (bookingNumber: string) => request(`/api/bookings/${bookingNumber}`);
export const submitContact = (body: object) => request('/api/contact', { method: 'POST', body: JSON.stringify(body) });

// --- Auth ---
export const login = (body: { phone: string; password: string }) =>
  request<{ token: string; user: { id: number; name: string; phone: string; role: string } }>(
    '/api/auth/login', { method: 'POST', body: JSON.stringify(body) }
  );

// --- Admin ---
export const getAdminStats = () => request('/api/admin/bookings/stats');
export const getAdminBookings = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request(`/api/admin/bookings${qs}`);
};
export const updateBookingStatus = (id: number, status: string, admin_notes?: string) =>
  request(`/api/admin/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, admin_notes }) });
export const assignTechnician = (bookingId: number, technician_id: number) =>
  request(`/api/admin/bookings/${bookingId}/assign`, { method: 'PUT', body: JSON.stringify({ technician_id }) });

export const getAdminServices = () => request('/api/admin/services');
export const createService = (body: object) => request('/api/admin/services', { method: 'POST', body: JSON.stringify(body) });
export const updateService = (id: number, body: object) => request(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteService = (id: number) => request(`/api/admin/services/${id}`, { method: 'DELETE' });

export const getAdminTechnicians = () => request('/api/admin/technicians');
export const createTechnician = (body: object) => request('/api/admin/technicians', { method: 'POST', body: JSON.stringify(body) });
export const updateTechnician = (id: number, body: object) => request(`/api/admin/technicians/${id}`, { method: 'PUT', body: JSON.stringify(body) });

// --- Technician ---
export const getTechnicianBookings = () => request('/api/technician/bookings');
export const completeBooking = (id: number, note?: string) =>
  request(`/api/technician/bookings/${id}/complete`, { method: 'PUT', body: JSON.stringify({ note }) });
