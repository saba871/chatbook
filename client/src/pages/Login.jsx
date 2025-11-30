import { useAuth } from "../context/AuthContext";

const LogIn = () => {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formObj = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    await login(formObj);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>logIn</h1>

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

      <button>LogIn</button>
    </form>
  );
};

export default LogIn;
