import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest, getSession } from '../services/authService';
import { CartItem } from '../utils/types';

type Lists = { cart: CartItem[]; wishlist: string[] };
const empty = (): Lists => ({ cart: [], wishlist: [] });

export function useShoppingLists(onError: (message: string) => void) {
  const [lists, setLists] = useState<Lists>(empty);
  const [loading, setLoading] = useState(true);
  const current = useRef<Lists>(empty());
  const generation = useRef(0);
  const loadedToken = useRef<string | undefined>(undefined);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const errorHandler = useRef(onError);
  errorHandler.current = onError;
  const clear = useCallback(() => {
    generation.current++;
    loadedToken.current = undefined;
    current.current = empty(); setLists(current.current);
    queue.current = Promise.resolve();
  }, []);
  const load = useCallback(async () => {
    clear();
    setLoading(true);
    const token = getSession()?.accessToken;
    const version = generation.current;
    if (!token) { setLoading(false); return; }
    try {
      const result = await apiRequest<Lists>('/api/profile/shopping');
      if (version !== generation.current || token !== getSession()?.accessToken) return;
      current.current = result; loadedToken.current = token; setLists(result); setLoading(false);
    } catch (e) {
      if (version === generation.current) errorHandler.current(e instanceof Error ? e.message : 'Không tải được giỏ hàng và yêu thích');
    }
  }, [clear]);
  useEffect(() => { void load(); return clear; }, [load, clear]);

  function update<K extends keyof Lists>(kind: K, transform: (items: Lists[K]) => Lists[K]): Promise<boolean> {
    const token = getSession()?.accessToken;
    const version = generation.current;
    if (!token || token !== loadedToken.current) {
      errorHandler.current(token ? 'Danh sách chưa tải xong. Vui lòng tải lại trang và thử lại.' : 'Vui lòng đăng nhập để lưu sản phẩm.');
      return Promise.resolve(false);
    }
    const task = queue.current.then(async () => {
      if (version !== generation.current || token !== getSession()?.accessToken) return false;
      try {
        const next = transform(current.current[kind]);
        const saved = await apiRequest<Lists[K]>(`/api/profile/shopping/${kind}`, { method: 'PUT', body: JSON.stringify(next) });
        if (version !== generation.current || token !== getSession()?.accessToken) return false;
        current.current = { ...current.current, [kind]: saved }; setLists(current.current);
        return true;
      } catch (e) {
        if (version === generation.current) errorHandler.current(e instanceof Error ? e.message : 'Không lưu được danh sách');
        return false;
      }
    });
    queue.current = task;
    return task;
  }
  return { cartItems: lists.cart, wishlistIds: lists.wishlist, update, load, clear, loading };
}
