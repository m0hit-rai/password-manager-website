import React, { useState } from "react";
import axios from "axios";

function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorStr, setErrorStr] = useState("");
    const { changeAlreadyReg, changeAlreadyLog, changeLogUserName } = props;

    const register = (e) => {
        // console.log("IN Register");
        e.preventDefault();

        axios({
            method: "post",
            data: {
                username,
                password
            },
            withCredentials: true,
            url: "http://localhost:33845/register"
        }).then((res) => {
            console.log(res);
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
        <h1>Register</h1>
        <div className="error">{errorStr}</div>
        <form>
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
                onClick={register}
            >Submit</button>
        </form>
        <div>
            <button
                className="small-button"
                onClick={(e) => changeAlreadyReg(1)}
            > Already Registered?</button>
        </div>
    </div>
}

export default Register;