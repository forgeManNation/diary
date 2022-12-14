import React, { useState } from 'react'
import DiaryWithAlerts from './components/DiaryWithAlerts';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login"
import Register from "./auth/Register"
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';




const App = () => {

  const [user, setuser] = useState<User | null>(null)


  onAuthStateChanged(auth, (logged_user: User | null) => {

    if (logged_user) {
      setuser(logged_user)
    }
    else {
      setuser(null)
    }
  })





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