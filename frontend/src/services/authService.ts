export interface NhaMinhAccount {
  fullName: string;
  email: string;
  password: string;
}

const ACCOUNT_STORAGE_KEY = 'nhaminh-account';
const LOGIN_STORAGE_KEY = 'nhaminh-logged-in';

export const registerAccount = (account: NhaMinhAccount) => {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};

export const getStoredAccount = (): NhaMinhAccount | null => {
  const account = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (!account) return null;

  try {
    return JSON.parse(account) as NhaMinhAccount;
  } catch {
    localStorage.removeItem(ACCOUNT_STORAGE_KEY);
    return null;
  }
};

export const loginAccount = (email: string, password: string): boolean => {
  const account = getStoredAccount();
  if (!account || account.email !== email || account.password !== password) return false;

  localStorage.setItem(LOGIN_STORAGE_KEY, 'true');
  return true;
};

export const isLoggedIn = (): boolean => localStorage.getItem(LOGIN_STORAGE_KEY) === 'true';

export const logoutAccount = () => localStorage.removeItem(LOGIN_STORAGE_KEY);
