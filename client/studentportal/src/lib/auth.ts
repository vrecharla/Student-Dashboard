const TOKEN_KEY = "auth_token";
const STUDENT_KEY = "auth_student";

export function setAuth(token: string, student: any) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
  } catch (e) {
    // ignore storage errors
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStudent(): any | null {
  try {
    const s = localStorage.getItem(STUDENT_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function getStudentId(): string | null {
  const s = getStudent();
  return s?.s_id ?? null;
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
  } catch {
    // ignore
  }
}

export default { setAuth, getToken, getStudent, getStudentId, clearAuth };
