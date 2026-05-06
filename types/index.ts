export interface Service {
  id: number;
  name_en: string;
  name_ta: string;
  description_en: string;
  description_ta: string;
  price_from: number;
  price_to: number;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  service_id: number;
  service_name_en?: string;
  service_name_ta?: string;
  service_name?: string;
  appliance_brand: string;
  issue_description: string;
  preferred_date: string;
  preferred_time_slot: string;
  status: BookingStatus;
  assigned_technician_id: number | null;
  technician_name?: string;
  technician_phone?: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'completed' | 'cancelled';

export interface BookingStatusLog {
  id: number;
  booking_id: number;
  old_status: BookingStatus | null;
  new_status: BookingStatus;
  changed_by: number | null;
  changed_by_name?: string;
  note: string | null;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'technician';
  is_active: boolean;
  created_at?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  role: 'admin' | 'technician';
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminStats {
  statusCounts: { status: BookingStatus; count: string }[];
  todayCount: number;
  recentBookings: Booking[];
  unreadMessages: number;
}

export type Language = 'en' | 'ta';
