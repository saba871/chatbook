import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const { signup } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formObj = {
            fullname: e.target.fullname.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        signup(formObj);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>

            <input
                type="text"
                name="fullname"
                placeholder="please enter your Fullname"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="please enter your Email"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="please enter your Password"
                required
            />

            <button>Signup</button>
        </form>
    );
};

export default SignUp;
