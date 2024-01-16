import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: ""
    //confirmPassword: "",
  });

  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  function redirecttoRegistation(){
    navigate("/");
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (data.name === "") {
      setError("Please enter your username");
      return;
    }
    if (data.email === "") {
      setError("Please enter your email");
      return;
    }
    if (data.password === "") {
      setError("Please enter your password");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      
      debugger
      const response = await axios.post("http://localhost:9000/signup", data);
      if (response.status === 201) {
        navigate("/");
      }
     
     
    } catch (error) {
    if(error.response.status === 409){
    setError("You can not use one email more than one time");
    }
    else if(error.response.status === 404){
    setError("Something went wrong!");
    }
     else{
      setError("An error occurred. Please try again.");
    }
    console.log(error);
    }
  };

  return (
    <div>
      <div className="authentication-model">
        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Username" value={data.name} required={true} onChange={handleChange}/>
          <input type="email" name="email" placeholder="Email"  value={data.email} required={true} onChange={handleChange}/>
          <input type="password" name="password" placeholder="Password" required={true} value={data.password} onChange={handleChange}/>
          <input type="password" name="confirmPassword" required={true} placeholder="Confirm Password" value={data.confirmPassword}
            onChange={handleChange}/>
          <input type="submit" className="submit-btn" value="Submit" />
          <button type="button" className="RediSignup" onClick={redirecttoRegistation}>Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <hr />
      </div>
    </div>
  );
};

export default Signup;