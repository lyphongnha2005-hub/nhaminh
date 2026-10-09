export type Role = 'ADMIN' | 'CUSTOMER';
export interface AuthUser { id:number; fullName:string; email:string; phone?:string; role:Role; status:string }
export interface AuthSession { accessToken:string; tokenType:string; expiresAt:string; user:AuthUser }
type AuthScope='store'|'admin';
const STORE_KEY='nhaminh-auth-session';
const ADMIN_KEY='nhaminh-admin-auth-session';
export class ApiError extends Error { constructor(public status:number,message:string){super(message)} }
const key=(scope:AuthScope)=>scope==='admin'?ADMIN_KEY:STORE_KEY;
const read=(scope:AuthScope='store'):AuthSession|null=>{const storageKey=key(scope);try{const value=localStorage.getItem(storageKey);if(!value)return null;const session=JSON.parse(value) as AuthSession;if(new Date(session.expiresAt)<=new Date()){localStorage.removeItem(storageKey);return null}return session}catch{localStorage.removeItem(storageKey);return null}};
export const getSession=(scope:AuthScope='store')=>read(scope);
export const getStoredAccount=()=>read('store')?.user??null;
export const isLoggedIn=()=>!!read('store');
export const logoutAccount=(scope:AuthScope='store')=>localStorage.removeItem(key(scope));
async function request<T>(path:string,init:RequestInit={},scope:AuthScope=path.startsWith('/api/admin/')?'admin':'store'):Promise<T>{const session=read(scope);const headers=new Headers(init.headers);if(!(init.body instanceof FormData))headers.set('Content-Type','application/json');if(session)headers.set('Authorization',`Bearer ${session.accessToken}`);const response=await fetch(path,{...init,headers});let data:any={};try{data=await response.json()}catch{}if(!response.ok){const isLoginRequest=path==='/api/auth/login';if(response.status===401 && !isLoginRequest && session?.accessToken === read(scope)?.accessToken){logoutAccount(scope);window.dispatchEvent(new CustomEvent('nhaminh-auth-expired',{detail:{scope}}))}throw new ApiError(response.status,data.message||'Không thể xử lý yêu cầu')}return data as T}
export async function loginAccount(email:string,password:string,scope:AuthScope='store'){const session=await request<AuthSession>('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})},scope);localStorage.setItem(key(scope),JSON.stringify(session));return session}
export async function registerAccount(input:{fullName:string;email:string;phone:string;password:string}){return request<AuthUser>('/api/auth/register',{method:'POST',body:JSON.stringify(input)})}
export async function resetPassword(input:{email:string;phone:string;newPassword:string}){return request<{message:string}>('/api/auth/reset-password',{method:'POST',body:JSON.stringify(input)})}
export async function verifySession(scope:AuthScope='store'){const user=await request<AuthUser>('/api/auth/me',{},scope);const session=read(scope);if(session)localStorage.setItem(key(scope),JSON.stringify({...session,user}));return user}
export async function apiRequest<T>(path:string,init?:RequestInit){return request<T>(path,init)}
