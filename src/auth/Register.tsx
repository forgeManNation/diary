import React from 'react'
import { createUserWithEmailAndPassword, auth, updateProfile, signInWithEmailAndPassword, db, doc, setDoc } from '../firebase'
import { useNavigate } from 'react-router-dom'
import "./authStyles.scss"
import { faExclamationCircle, faPersonCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User, UserCredential } from 'firebase/auth';
import authErrors from "./authErrors.json"

const Register = () => {

  const [email, setemail] = React.useState("")
  const [password, setpassword] = React.useState("")
  const [name, setname] = React.useState("")
  const [profilePicUrl, setprofilePicUrl] = React.useState("")
  const [errorMessage, seterrorMessage] = React.useState("")

  let navigate = useNavigate()

  async function register() {

    let createdName = name !== "" ? name : "user"

    try {
      const userAuth: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      updateProfile(userAuth.user, {
        displayName: createdName,
        photoURL: profilePicUrl
      })

    }
    catch (err) {

      //slicing the message to part which authErrors object has as key
      let splicedFireAuthMessage = err.message.substring(err.message.indexOf("/") + 1, err.message.indexOf(")"))

      //getting error rewritten for user 
      let userMessage = authErrors[splicedFireAuthMessage as keyof typeof authErrors]

      seterrorMessage(userMessage)


    }

  }


  return (
    <div className='w-full  d-flex justify-content-center align-content-center flex-wrap authBg'>
      <div className='mainAuthContainer bg-light p-5 pt-4 pb-0'  >
        <h3 className='pb-2'>Register in to<br /><strong>travellers diary</strong></h3>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" value={email} onChange={(e) => { setemail(e.target.value) }} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" value={password} onChange={(e) => { setpassword(e.target.value) }} className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">Name</label>
          <input type="name" value={name} onChange={(e) => { setname(e.target.value) }} className="form-control" id="exampleInputName" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputprofilePicUrl" className="form-label">Profile picture URL</label>
          <input type="profilePicUrl" value={profilePicUrl} onChange={(e) => { setprofilePicUrl(e.target.value) }} className="form-control" id="exampleInputprofilePicUrl" />
        </div>

        <p>have an account already? <span onClick={() => { navigate("../", { replace: true }) }} role="button" className='text-primary'>Log in</span> instead</p>

        <div className='authActionButton'>
          <button onClick={register} className="btn btn-outline-dark w-10">Register</button>
          &nbsp;&nbsp;
          <button className='btn text-dark'>guest login</button>
        </div>

        {/* if register failed display this message  */}
        {errorMessage !== "" ?
          <div className='errorMessageContainer' >
            <p className='errorMessage' >
              <FontAwesomeIcon icon={faExclamationCircle}></FontAwesomeIcon>
              &nbsp;
              {errorMessage}
            </p>
          </div>
          :
          <></>
        }

      </div>
    </div>
  )
}

export default Register