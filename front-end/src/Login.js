import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'
import axios from 'axios'


function Login() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
   // const [User, setUser] = useState(null);
    const [cookie,setCookie,removeCookie] = useCookies(['data'])
    function handleUsernameChange(event) {
        setemail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }
    function redirecttoRegistation(){
        navigate("/Signup");
    }
        const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
       
            const responsce = await axios.post(`http://localhost:9000/login`,{email,password})
            debugger
            const success = responsce.status === 201
            setCookie('email',responsce.data.email)
            setCookie('userid',responsce.data.user_id)
            setCookie('user_name',responsce.data.user_name)

            if(success) navigate('/Home')
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="authentication-model">
            <form onSubmit={handleSubmit}>
                <input type="text" name="email" placeholder="email" required={true} value={email} onChange={handleUsernameChange}/>
                <input type="password" name="password"  placeholder="Password" required={true} value={password} onChange={handlePasswordChange}/>
                <button type="submit">Login</button>
                <button type="button" className="RediSignup" onClick={redirecttoRegistation}>New User</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;