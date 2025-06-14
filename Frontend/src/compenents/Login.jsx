import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const Navigate = useNavigate();

    const loginHandler = async () => {

        if (!username || !password) {
            toast.error("Please fullfil the required details");
            return;
        }

        const sendData = { username, password }
        // console.log(sendData);

        try {
            let response = await axios.post("http://localhost:3000/user/login", sendData, {
                headers: {
                    "Content-type": "Application/json"
                }
            })
            if (response.status === 200) {
                const token = await response.data.token;
                localStorage.setItem("token", token);

                const decoded = jwtDecode(token);
                let role = decoded.roles;
                localStorage.setItem("role", role);
                Navigate("/");
                toast.success("Welcome Traveller");
            }
        } catch (error) {
            console.log("Login " + error);
        }
    }

    return (
        <div className="loginpage-container">
            <div className="loginpage">
                <h3 className="loginpage-title">Log in</h3>
                <div className="loginpage-field">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" required autoComplete="off"
                        onChange={(e) => { setUsername(e.target.value) }} />
                </div>
                <div className="loginpage-field">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" required autoComplete="off"
                        onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <div className="loginpage-field">
                    <div></div>
                    <button className="loginBN" onClick={() => loginHandler()}>Login</button>
                </div>
            </div>
        </div >
    )
}

export default Login;