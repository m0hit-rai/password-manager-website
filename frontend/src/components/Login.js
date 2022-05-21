import React, { useState } from "react";
import axios from "axios";

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorStr, setErrorStr] = useState("");
    const { changeAlreadyReg, changeAlreadyLog, changeLogUserName } = props;

    const login = (e) => {
        // console.log("IN LOGIN");
        e.preventDefault();
        axios({
            method: "post",
            data: {
                username: username,
                password: password
            },
            withCredentials: true,
            url: "http://localhost:33845/login"
        }).then((res) => {
            // console.log(res);
            setPassword("");
            setErrorStr("");
            changeLogUserName(username);
            setUsername("");
            changeAlreadyLog(1);
        }).catch((err) => {
            // console.log(err);
            setErrorStr(err.response.data);
        })
    };

    return <div className="enter-credentials">
        <h1>Login</h1>
        <div className="error">{errorStr}</div>
        <form className="credential-form">
            <input
                type="text"
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            ></input>
            <input
                type="password"
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button
                onClick={login}
            >Submit</button>
        </form>
        <div>
            <button
                className="small-button"
                onClick={(e) => changeAlreadyReg(0)}
            > Register new user?</button>
        </div>
    </div>
}

export default Login;