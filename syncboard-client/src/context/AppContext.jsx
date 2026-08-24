import { createContext, useState, useContext, useEffect } from 'react';
import { mockBoards, mockUsers } from '../data/mockData';
import { AVATAR_OPTIONS } from '../data/avatars';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [boards, setBoards] = useState(mockBoards);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

    // Global avatar state — shared between Profile.jsx and Navbar.jsx
    const [userAvatar, setUserAvatar] = useState(AVATAR_OPTIONS[0]);

    // Re-derive pendingInvites whenever the logged-in user changes
    useEffect(() => {
        if (!currentUser) {
            setPendingInvites([]);
            setUserAvatar(AVATAR_OPTIONS[0]); // reset avatar on logout
            return;
        }
        const user = mockUsers.find(u => u.username === currentUser);
        setPendingInvites(user?.pendingInvites || []);
    }, [currentUser]);

    return (
        <AppContext.Provider value={{
            currentUser, setCurrentUser,
            boards, setBoards,
            pendingInvites, setPendingInvites,
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
