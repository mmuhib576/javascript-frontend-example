import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import axios from "axios";
import { useEffect,useState } from "react"


  
const Home = () =>{
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['email', 'userid', 'user_name']);
  const user_id = cookies.userid;
  console.log(cookies.userid);
  const [error, setError] = useState(null);
  const [updatemsg, setUpdatemsg] = useState(null);
    //Code for the update

    useEffect(() => {
      // Redirect to login page if user is not logged in
      if (!user_id) {
        navigate("/login");
      }
    }, [user_id, navigate]);

    const [data, setData] = useState({
        name: cookies.user_name,
        email: cookies.email,
        password: cookies.password,
        confirmPassword: cookies.password,
      });

      const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
      };
       const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:9000/delete/${user_id}`);
      if (response.status === 200) {
        removeCookie('email');
        removeCookie('userid');
        removeCookie('user_name');
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
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
    if (data.password !== "" && data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        user_id : user_id,
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await axios.put(
        `http://localhost:9000/update/`,
        payload
      );
      if (response.status === 200) {
        setCookie('email', data.email);
        setCookie('user_name', data.name);
        setUpdatemsg(true);
      }
    } catch (error) {
      if (error.response.status === 409) {
        setError("You cannot use the same email twice.");
      } else if (error.response.status === 404) {
        setError("User not found.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.log(error);
    }
  };

    //Code for the update ends

    return (
        <div>
        <div className="homepage">
            Welcome to Home page {cookies.user_name}
        </div>
        { updatemsg && <div className="homepage">
         Update Successfull
        </div>}
        <div>
        <div className="authentication-model">
          <h3>Update</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Username" value={data.name} required={true} onChange={handleChange}/>
            <input type="email" name="email" placeholder="Email"  value={data.email} required={true} onChange={handleChange}/>
            <input type="password" name="password" placeholder="Password" required={true} value={data.password} onChange={handleChange}/>
            <input type="password" name="confirmPassword" required={true} placeholder="Confirm Password" value={data.confirmPassword}
              onChange={handleChange}/>
            <input type="submit" className="submit-btn" value="Update" />
            <button type="button" className="Deletebtn" onClick={handleDelete}>Delete</button>
            {error && <p className="error">{error}</p>}
          </form>
          <hr />
        </div>
      </div>
      </div>
    )
}
export default Home