import { stringLength } from '@firebase/util'
import { User } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {auth, signInWithEmailAndPassword} from '../firebase'

interface Props{
    // changeUser: (user: User) => void
}

const Login = ({}: Props) => {

  let navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  //sign in to firebase than change the high order User object with retrieved data
  //TODO: add functionality fow when the login fails
    async function logIn (){


        await signInWithEmailAndPassword(auth, email, password).then(
          

            userAuth => {
              console.log("succesfully logged in");
              
            }
        )
    }

  return (
    <div className='w-full  d-flex justify-content-center align-content-center flex-wrap authBg'>
    <div className='mainAuthContainer   bg-light  p-5 pt-3'>
    <h3 className='pb-2'>Sign in to <br/><strong>travellers diary</strong></h3>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" value={email} onChange = {(e) => {setemail(e.target.value)}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" value={password} onChange = {(e) => {setpassword(e.target.value)}} className="form-control" id="exampleInputPassword1"/>
  </div>
  <div className="mb-3 form-check">
    
    <p >No account? <span role= "button" className='text-primary' onClick={() => {navigate("register", { replace: true });}}>Register instead</span> </p>
  </div>
  <button  onClick={logIn} className="btn btn-outline-dark">Sign in</button>
</div>
</div>
  )
}

export default Login