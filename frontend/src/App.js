import React, { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import './App.css';
import Register from './components/Register';
import ProfileView from './components/ProfileView';


function App() {
	const [alreadyReg, setAlreadyReg] = useState(0);
	// alreadyRegistered means that the user is already registered, and needs to go to the login page.
	const [alreadyLog, setAlreadyLog] = useState(0);
	// alreadyLoggedIn means that the user is already LoggedIn, and needs to go to his/her profile.
	const [userName, setUserName] = useState("");
	// this is the username that will be passed in the profile view for which we will then fetch the data i.e., passwords.

	let view;
	if (alreadyLog === 1)
		view = <ProfileView
			userName={userName}
			changeAlreadyLog={setAlreadyLog}
		/>
	else if (alreadyReg === 1)
		view = <Login
			changeAlreadyReg={setAlreadyReg}
			changeAlreadyLog={setAlreadyLog}
			changeLogUserName={setUserName}
		/>
	else
		view = <Register
			changeAlreadyReg={setAlreadyReg}
			changeAlreadyLog={setAlreadyLog}
			changeLogUserName={setUserName}
		/>


	return (
		<div className="App">
			<Header />
			<div className='firstPage'>
				{view}
			</div>

		</div>
	);
}

export default App;
