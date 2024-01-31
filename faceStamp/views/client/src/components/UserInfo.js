// import React, { createContext, useState, useContext, useEffect } from 'react';
// import jwt_decode from 'jwt-decode'

// const Context = createContext();

// export function UserContextProvider({ children }) {
// 	const [user, setUser] = useState({});

// 	const token = localStorage.getItem("YJ_AUT");

// 	useEffect(() => {
// 		const getUserInfo = async () =>{
// 			try {
// 				const userInfo = await jwt_decode(token);
// 				console.log(userInfo);
// 				setUser(userInfo);
// 				console.log(user)
// 				// valid token format
// 			} catch(error) {
// 				// invalid token format
// 				console.log("error: " + JSON.stringify(localStorage));
// 			}
// 		}
// 		getUserInfo();
// 	},[])

// 	return(
// 		<Context.Provider value={user}>
// 			{children}
// 		</Context.Provider>
// 	)
// }

// export function useUserContext() {
// 	return useContext(Context);
// }
