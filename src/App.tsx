import React, {useState} from 'react'
import Diary from './components/Diary';
import { BrowserRouter, Link, Routes, Route} from "react-router-dom";
import Login from "./auth/Login"
import Register from "./auth/Register"
import { User } from 'firebase/auth';
const App = () => {

  const [user, setuser] = useState<User | null>(null)
  const [loggedIn, setloggedIn] = useState(false)
  const [editModeOn, seteditModeOn] = useState(false)

  function changeEditMode(changeEditModeToOn : boolean){
    seteditModeOn(changeEditModeToOn)
  }

  function changeUser(user : User | null){
    setuser(user)
  }

  return (
    <BrowserRouter>
   
      {
        user ? 
      <Routes>
      <Route path="/" element={<Diary user = {user} changeUser = {changeUser} changeEditMode = {changeEditMode} editMode = {false}  />} />
      <Route path="edit" element={<Diary user = {user} changeUser = {changeUser} changeEditMode = {changeEditMode} editMode = {true} />} />
      </Routes>
    :
    <Routes>
    <Route path= "login" element={<Login changeUser ={changeUser}  />} />
    <Route path="register" element={<Register changeUser ={changeUser} />} />
    <Route path = "/*" element={<Login changeUser={changeUser} />} />

    </Routes>
      }

   
    </BrowserRouter>
  )
}

export default App