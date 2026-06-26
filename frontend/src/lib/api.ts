import { API_BASE_URL } from './config';

async function request<T>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed (${res.status})`);
  }

  return data as T;
}

export const registerUser = (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  school: string;
  role: string;
}) => request<{ message: string; code: string }>('/auth/register', {
  method: 'POST',
  body,
});

export const verifyEmail = (email: string, code: string) =>
  request<{ message: string; token: string }>('/auth/verify', {
    method: 'POST',
    body: { email, code },
  });

export const loginUser = (email: string, password: string) =>
  request<{ message: string; token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

export const getMe = (token: string) =>
  request<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    role: string;
  }>('/auth/me', { token });

export interface Report {
  _id: string;
  bullyName?: string;
  type: string;
  description: string;
  location?: string;
  dateOccurred?: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
}

export const submitReport = (token: string, body: {
  bullyName?: string;
  type: string;
  description: string;
  location?: string;
  dateOccurred?: string;
  isAnonymous?: boolean;
}) => request<{ message: string; report: Report }>('/reports', {
  method: 'POST',
  token,
  body,
});

export const getReports = (token: string) =>
  request<Report[]>('/reports', { token });