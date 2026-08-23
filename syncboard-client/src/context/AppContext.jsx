import { createContext, useState, useContext, useEffect } from 'react';
import { mockBoards, mockUsers } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [boards, setBoards] = useState(mockBoards);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

    // Re-derive pendingInvites whenever the logged-in user changes
    useEffect(() => {
        if (!currentUser) {
            setPendingInvites([]);
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
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
