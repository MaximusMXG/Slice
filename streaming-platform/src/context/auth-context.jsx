import { createContext, useState, useEffect } from 'react';
import { api, userService } from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userService.getProfile()
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await userService.login(email, password);
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await userService.register(username, email, password);
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
