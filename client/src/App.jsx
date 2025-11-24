// App.jsx
import { Routes, Route } from 'react-router-dom';

// pages
import SignUp from './pages/Signup';
import Home from './pages/Home';
import Nav from './components/Nav';
import Profile from './pages/Profile';
import LogIn from './pages/Login';
import Posts from './pages/Posts';

//
import { useAuth } from './context/AuthContext';

const App = () => {
    const { user } = useAuth();
    console.log(user);

    return (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={user ? <Profile /> : <LogIn />} />
                <Route path="/posts" element={user ? <Posts /> : <LogIn />} />
            </Routes>
        </>
    );
};

export default App;
