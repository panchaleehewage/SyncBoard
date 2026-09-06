import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AVATAR_OPTIONS } from '../data/avatars';
import { apiLogin, apiRegister, apiGetMe, apiUpdateMe } from '../api/auth.api';

const TOKEN_KEY = 'syncboard_token';

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [currentUserData, setCurrentUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(!!localStorage.getItem(TOKEN_KEY)); 

    const [boards, setBoards] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [authModal, setAuthModal] = useState(null); 

    const [userAvatar, setUserAvatar] = useState(AVATAR_OPTIONS[0]);

    const hydrateUser = useCallback((user, token) => {
        setCurrentUser(user.username);
        setCurrentUserData(user);
        setAuthToken(token);
        localStorage.setItem(TOKEN_KEY, token);
        setPendingInvites(user.pendingInvites || []);
        if (user.avatar) {
            const saved = AVATAR_OPTIONS.find(a => a.id === user.avatar?.id);
            if (saved) setUserAvatar(saved);
        }
    }, []);

    const clearUser = useCallback(() => {
        setCurrentUser(null);
        setCurrentUserData(null);
        setAuthToken(null);
        setPendingInvites([]);
        setUserAvatar(AVATAR_OPTIONS[0]);
        localStorage.removeItem(TOKEN_KEY);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) { setAuthLoading(false); return; }

        apiGetMe(token)
            .then(({ user }) => hydrateUser(user, token))
            .catch(() => {
                clearUser();
            })
            .finally(() => setAuthLoading(false));
    }, []);

    useEffect(() => {
        if (!authToken) return;
        fetch('/api/boards', {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setBoards(data.data);
                }
            })
            .catch(console.error);
    }, [authToken]);

    const login = useCallback(async (username, password) => {
        const { user, token } = await apiLogin(username, password);
        hydrateUser(user, token);
        setAuthModal(null);
    }, [hydrateUser]);

    const register = useCallback(async (username, email, password) => {
        const { user, token } = await apiRegister(username, email, password);
        hydrateUser(user, token);
        setAuthModal(null);
    }, [hydrateUser]);

    const logout = useCallback(() => {
        clearUser();
    }, [clearUser]);

    const updateProfile = useCallback(async (updates) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const { user } = await apiUpdateMe(token, updates);
        setCurrentUserData(user);
        setCurrentUser(user.username);
        if (user.avatar) {
            const saved = AVATAR_OPTIONS.find(a => a.id === user.avatar?.id);
            if (saved) setUserAvatar(saved);
        }
        return user;
    }, []);

    useEffect(() => {
        if (!currentUser) { setPendingInvites([]); }
    }, [currentUser]);

    return (
        <AppContext.Provider value={{
            // Auth
            currentUser, setCurrentUser,
            currentUserData,
            authToken,
            authLoading,
            login, register, logout, updateProfile,
            // Board
            boards, setBoards,
            pendingInvites, setPendingInvites,
            // UI
            authModal, setAuthModal,
            userAvatar, setUserAvatar,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
