import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfileView(props) {
    const { userName } = props;
    const [site, setSite] = useState("");
    const [siteUsername, setSiteUsername] = useState('');
    const [sitePassword, setSitePassword] = useState("");
    const [data, setData] = useState([]);
    const [note, setNote] = useState("");

    useEffect(() => {
        getAllData();
    }, []);

    const addNewPass = (event) => {
        event.preventDefault();
        const newData = {
            username: userName,
            site: site,
            siteUsername: siteUsername,
            sitePassword: sitePassword,
            note: note,
        };
        axios({
            method: "post",
            data: newData,
            withCredentials: true,
            url: "http://localhost:33845/addPass"
        }).then((res) => {
            // console.log(res);
            setNote("");
            setSite("");
            setSitePassword("");
            setSiteUsername("");
            getAllData();
        }).catch((err) => {
            console.log(err);
            alert("Some error Occurred");
        })
    }

    const getAllData = (event) => {
        // event.preventDefault();

        axios({
            method: "get",
            url: `http://localhost:33845/user/${userName}`

        }).then(res => {
            // console.log(res);
            setData(res.data);

        }).catch(err => {
            console.log(err);
        })

    };

    const deletePass = (event) => {
        event.preventDefault();
        // console.log(event.currentTarget.parentNode.getAttribute("data-key"));
        axios({
            method: "get",
            url: `http://localhost:33845/deleteData/${event.currentTarget.parentNode.getAttribute("data-key")}`
        }).then(res => {
            console.log(res);
            getAllData();
        }).catch(err => {
            console.log(err);
        })
    }
    return <>
        <h1>Hello user {userName} !</h1>
        <form className="add-pass">
            <input
                type="text"
                placeholder='site'
                value={site}
                onChange={(e) => setSite(e.target.value)}
            ></input>
            <input
                type="text"
                placeholder='site-username'
                value={siteUsername}
                onChange={(e) => setSiteUsername(e.target.value)}
            ></input>
            <input
                type="password"
                placeholder='site-password'
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
            ></input>
            <input
                type="text"
                placeholder='note'
                value={note}
                onChange={(e) => setNote(e.target.value)}
            ></input>
            <button
                disabled={site.length === 0 || siteUsername.length === 0 || sitePassword.length === 0}
                onClick={addNewPass}
            >Add New Pass</button>
            {/* <button
                onClick={getAllData}
            >getAllData</button> */}
        </form>
        <div className="user-data">
            {data.map((element) => {
                return <div
                    key={element.key}
                    data-key={element.key}
                    className="secret-data">
                    <h3>{element.site}</h3>
                    <img
                        alt="delete password"
                        src="https://img.icons8.com/wired/64/000000/filled-trash.png"
                        onClick={deletePass}
                    // style={"width" = "100px"; "height" = "100px"}
                    />
                    <input
                        type="text"
                        value={element.siteUsername}
                    >
                    </input>
                    <input
                        type="text"
                        value={element.sitePassword}
                    >
                    </input>
                    <input
                        type="text"
                        value={element.note}
                    >
                    </input>
                </div>
            })}
        </div>
    </>;
}

export default ProfileView;