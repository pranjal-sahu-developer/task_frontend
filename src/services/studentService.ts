import api from './api';
import { decryptData, encryptData } from '../utils/crypto';

export interface StudentFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

export type StudentUpdateFormData = Omit<StudentFormData, 'password'>;

export interface EncryptedStudent extends StudentFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends StudentFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  token?: string;
}

const STUDENT_FIELDS: (keyof StudentFormData)[] = [
  'fullName',
  'email',
  'phoneNumber',
  'dateOfBirth',
  'gender',
  'address',
  'courseEnrolled',
  'password',
];

const STUDENT_UPDATE_FIELDS: (keyof StudentUpdateFormData)[] = [
  'fullName',
  'email',
  'phoneNumber',
  'dateOfBirth',
  'gender',
  'address',
  'courseEnrolled',
];

export const encryptStudentPayload = (
  data: StudentFormData,
): Record<keyof StudentFormData, string> => {
  const encrypted = {} as Record<keyof StudentFormData, string>;

  for (const field of STUDENT_FIELDS) {
    encrypted[field] = encryptData(data[field]);
  }

  return encrypted;
};

export const encryptStudentUpdatePayload = (
  data: StudentUpdateFormData,
): Record<keyof StudentUpdateFormData, string> => {
  const encrypted = {} as Record<keyof StudentUpdateFormData, string>;

  for (const field of STUDENT_UPDATE_FIELDS) {
    encrypted[field] = encryptData(data[field]);
  }

  return encrypted;
};

export const decryptStudentPayload = (
  encrypted: EncryptedStudent,
): Student => {
  const decrypted = {
    _id: encrypted._id,
    createdAt: encrypted.createdAt,
    updatedAt: encrypted.updatedAt,
  } as Student;

  for (const field of STUDENT_FIELDS) {
    if (field === 'password') {
      decrypted.password = '';
      continue;
    }

    decrypted[field] = decryptData(encrypted[field]);
  }

  return decrypted;
};

export const registerStudent = async (
  data: StudentFormData,
): Promise<Student> => {
  const response = await api.post<ApiResponse<Student>>(
    '/register',
    encryptStudentPayload(data),
  );

  return response.data.data!;
};

export const getStudents = async (): Promise<EncryptedStudent[]> => {
  const response = await api.get<ApiResponse<EncryptedStudent[]>>('/students');

  return response.data.data ?? [];
};

export const getDecryptedStudents = async (): Promise<Student[]> => {
  const encryptedStudents = await getStudents();
  return encryptedStudents.map(decryptStudentPayload);
};

export const updateStudent = async (
  id: string,
  data: StudentUpdateFormData,
): Promise<EncryptedStudent> => {
  const encryptedPayload = encryptStudentUpdatePayload(data);

  const response = await api.put<ApiResponse<EncryptedStudent>>(
    `/student/${id}`,
    encryptedPayload,
  );

  return response.data.data!;
};

export const updateDecryptedStudent = async (
  id: string,
  data: StudentUpdateFormData,
): Promise<Student> => {
  const updated = await updateStudent(id, data);
  return decryptStudentPayload(updated);
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/student/${id}`);
};

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await api.post<ApiResponse<void>>('/login', {
    email: encryptData(credentials.email),
    password: encryptData(credentials.password),
  });

  return response.data.token!;
};
