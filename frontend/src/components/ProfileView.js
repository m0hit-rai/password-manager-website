import React from "react";

function ProfileView(props) {
    const { userName } = props
    return <h1>Hello {userName} !</h1>;
}

export default ProfileView;