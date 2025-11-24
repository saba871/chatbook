import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
    const { user, logOut } = useAuth();

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    {user ? (
                        <>
                            <li>
                                <Link to={'/profile'}>profile</Link>
                            </li>
                            <li>
                                <Link to={'/posts'}>posts</Link>
                            </li>
                            <li onClick={logOut}>logOut</li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to={'/login'}>login</Link>
                            </li>
                            <li>
                                <Link to={'/signup'}>signup</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Nav;
