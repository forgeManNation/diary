import React, {useState} from 'react'
import Diary from './components/Diary';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./auth/Login"
import Register from "./auth/Register"
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
const App = () => {

  const [user, setuser] = useState<User | null>(null)

  onAuthStateChanged(auth, (logged_user : User | null) => {

    
    if(logged_user){
      
      setuser(logged_user)
    }
    else{
      setuser(null)
    }
  })


  
  

  function changeUser(user : User | null){
    console.log(user, "i shall happen :P");
    
    // setuser(user)
  }

  return (
    <BrowserRouter>
   
      {
        user !== null ? 
      <Routes>
      <Route path="/" element={<Diary user = {user}  editMode = {false}  />} />
      <Route path="edit" element={<Diary user = {user}  editMode = {true} />} />
      </Routes>
    :
    <Routes>
    <Route path= "login" element={<Login  />} />
    <Route path="register" element={<Register  />} />
    <Route path = "/*" element={<Login  />} />

    </Routes>
      }

   
    </BrowserRouter>
  )
}

export default App