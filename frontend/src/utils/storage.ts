// export const storage = {
//   getToken: (): string | null => localStorage.getItem('token'),
//   setToken: (token: string): void => localStorage.setItem('token', token),
//   removeToken: (): void => localStorage.removeItem('token'),
// };

const TOKEN_KEY = 'auth_token';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};