import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import EditStudentForm from './EditStudentForm';
import {
  deleteStudent,
  getDecryptedStudents,
  getStudents,
  type EncryptedStudent,
  type Student,
} from '../services/studentService';

const formatDate = (date: string): string => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString();
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'Something went wrong. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [editingStudent, setEditingStudent] = useState<EncryptedStudent | null>(
    null,
  );
  const [isOpeningEdit, setIsOpeningEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDecryptedStudents();
      setStudents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleEditClick = async (studentId: string) => {
    setActionMessage(null);
    setIsOpeningEdit(true);

    try {
      const encryptedStudents = await getStudents();
      const encryptedStudent = encryptedStudents.find(
        (student) => student._id === studentId,
      );

      if (!encryptedStudent) {
        throw new Error('Student record not found.');
      }

      setEditingStudent(encryptedStudent);
    } catch (err) {
      setActionMessage({
        type: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsOpeningEdit(false);
    }
  };

  const handleEditClose = () => {
    setEditingStudent(null);
  };

  const handleEditSuccess = async (message: string) => {
    setActionMessage({ type: 'success', message });
    await loadStudents();
  };

  const handleEditError = (message: string) => {
    setActionMessage({ type: 'error', message });
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`,
    );

    if (!confirmed) {
      return;
    }

    setActionMessage(null);
    setDeletingId(id);

    try {
      await deleteStudent(id);
      setActionMessage({
        type: 'success',
        message: 'Student deleted successfully.',
      });
      await loadStudents();
    } catch (err) {
      setActionMessage({
        type: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Student List
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Encrypted records are decrypted on the frontend for display.
            </p>
          </div>
          <button
            type="button"
            onClick={loadStudents}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {actionMessage && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              actionMessage.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
            role="alert"
          >
            {actionMessage.message}
          </div>
        )}

        {loading && (
          <p className="mt-8 text-center text-sm text-gray-500">
            Loading students...
          </p>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-500">
            No students found. Register a student to see them here.
          </p>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            <div className="mt-6 hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Full Name
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      DOB
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Gender
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Address
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Course
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(student.dateOfBirth)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.gender}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-gray-600">
                        {student.address}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.courseEnrolled}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(student._id)}
                            disabled={isOpeningEdit}
                            className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isOpeningEdit ? 'Loading...' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(student._id, student.fullName)
                            }
                            disabled={deletingId === student._id}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === student._id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-4 md:hidden">
              {students.map((student) => (
                <article
                  key={student._id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {student.fullName}
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-gray-500">Email</dt>
                      <dd className="text-right text-gray-800">
                        {student.email}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-gray-500">Phone</dt>
                      <dd className="text-right text-gray-800">
                        {student.phoneNumber}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-gray-500">DOB</dt>
                      <dd className="text-right text-gray-800">
                        {formatDate(student.dateOfBirth)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-gray-500">Gender</dt>
                      <dd className="text-right text-gray-800">
                        {student.gender}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-gray-800">{student.address}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-gray-500">Course</dt>
                      <dd className="text-right text-gray-800">
                        {student.courseEnrolled}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(student._id)}
                      disabled={isOpeningEdit}
                      className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isOpeningEdit ? 'Loading...' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(student._id, student.fullName)
                      }
                      disabled={deletingId === student._id}
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === student._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {editingStudent && (
        <EditStudentForm
          encryptedStudent={editingStudent}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          onError={handleEditError}
        />
      )}
    </div>
  );
}

export default StudentList;
