import React, { useState } from 'react'
import Diary from './components/Diary';
import DiaryWithAlerts from './components/DiaryWithAlerts';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login"
import Register from "./auth/Register"
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signOut } from './firebase';




const App = () => {

  // signOut(auth)

  const [user, setuser] = useState<User | null>(null)



  onAuthStateChanged(auth, (logged_user: User | null) => {

    if (logged_user) {
      setuser(logged_user)
    }
    else {
      setuser(null)
    }
  })





  function changeUser(user: User | null) {
    console.log(user, "i shall happen :P");

    // setuser(user)
  }



  return (
    <BrowserRouter>

      {
        user !== null ?
          <Routes>
            <Route path="/" element={<DiaryWithAlerts user={user} editMode={false} />} />
            <Route path="edit" element={<DiaryWithAlerts user={user} editMode={true} />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          :
          <Routes>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="/*" element={<Login />} />
          </Routes>
      }
    </BrowserRouter>
  )
}

export default App