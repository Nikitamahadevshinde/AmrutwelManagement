import "./Login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Amrutwel Management System</h1>

        <h2>Owner Login</h2>

        <input 
          type="email" 
          placeholder="Enter Email"
        />

        <input 
          type="password" 
          placeholder="Enter Password"
        />

        <button>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;