import React from 'react'
import { createUserWithEmailAndPassword, auth, updateProfile, signInWithEmailAndPassword } from '../firebase'
import { useNavigate } from 'react-router-dom'
import "./authStyles.scss"
import {faPersonCircleQuestion  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from 'firebase/auth';

interface Props{
  // changeUser: (user: User) => void
}

const Register = ({}: Props) => {

  const [email, setemail] = React.useState("")
  const [password, setpassword] = React.useState("")
  const [name, setname] = React.useState("")
  const [profilePicUrl, setprofilePicUrl] = React.useState("")
  const [authError, setauthError] = React.useState("")

  let navigate = useNavigate()

  async function register(){ 

    try{
    await createUserWithEmailAndPassword(auth, email, password)
    .then( userAuth => {updateProfile(userAuth.user, {
      displayName: name,
      photoURL: profilePicUrl
    })
  })
  
  //signing the user in after succesful registration
  await signInWithEmailAndPassword(auth, email,password).then(userAuth => {
    console.log('succesfully logged in mate :) good job');
    
    // changeUser(userAuth.user)
  })
    }
    catch(err){

      let strippedErr = err.message.match(/\(([^)]+)\)/)[1]
      setauthError(strippedErr + ", try again")
      
    }
}


  return (
    <div className='w-full  d-flex justify-content-center align-content-center flex-wrap authBg'>
        <div className='bg-light  p-5 pt-3'  >
        <h3 className='pb-2'>Register in to<br/><strong>travellers diary</strong></h3>
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
        <input type="email" value={email} onChange = {(e) => {setemail(e.target.value)}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
        <input type="password" value={password} onChange = {(e) => {setpassword(e.target.value)}} className="form-control" id="exampleInputPassword1"/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputName" className="form-label">Name</label>
        <input type="name" value={name} onChange = {(e) => {setname(e.target.value)}} className="form-control" id="exampleInputName"/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputprofilePicUrl" className="form-label">Profile picture URL</label>
        <input type="profilePicUrl" value={profilePicUrl} onChange = {(e) => {setprofilePicUrl(e.target.value)}} className="form-control" id="exampleInputprofilePicUrl"/>
      </div>
      
      <p>have an account already? <span onClick={() => {navigate("../", { replace: true })}} role="button" className='text-primary'>Log in</span> instead</p>

      <button  onClick={register} className="btn btn-outline-dark">Register</button>
      <button className='btn btn-link text-dark'><FontAwesomeIcon  icon={faPersonCircleQuestion} />&nbsp;&nbsp;try it out as a guest! </button>
      <p className='text-danger'>{authError}</p>
    </div>
</div>
  )
}

export default Register