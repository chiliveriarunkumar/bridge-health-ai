import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, UserRole } from '@/types';

interface AuthActions {
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, accessToken: string) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'uhb-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hooks
export const useAuth = () => {
  const { user, isAuthenticated, accessToken } = useAuthStore();
  return { user, isAuthenticated, accessToken };
};

export const useUserRole = () => {
  const { user } = useAuthStore();
  return user?.role as UserRole | undefined;
};