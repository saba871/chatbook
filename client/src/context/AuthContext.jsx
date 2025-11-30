import { createContext, useContext, useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:3000/api';
// const API_URL = import.meta.env.VITE_SERVER_URL;
console.log(import.meta.env.VITE_SERVER_URL);
// http://localhost:3000/api

//
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const autoLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/auto-login`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await res.json();

            setUser(result.data.user);
            // if (res.ok && result.data?.user) {
            // } else {
            //     setUser(null);
            // }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        autoLogin();
    }, []);

    const signup = async (formObj) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(formObj),
                credentials: 'include',
            });

            const data = await res.json();
            alert(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const login = async (formObj) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(formObj),
                credentials: 'include',
            });

            const result = await res.json();

            if (res.ok && result.data?.user) {
                setUser(result.data.user);
                navigate('/profile');
            } else {
                setUser(null);
                alert(result.message || 'Login failed');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const logOut = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message);

            setUser(null);
            alert(result.message);
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider value={{ signup, login, user, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
