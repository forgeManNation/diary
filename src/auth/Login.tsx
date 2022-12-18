import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signInWithEmailAndPassword } from '../firebase'
import authErrors from './authErrors.json'


const Login = () => {

  let navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [errorMessage, seterrorMessage] = useState("")

  //sign in to firebase
  async function logIn() {

    await signInWithEmailAndPassword(auth, email, password)
      .catch(err => {

        //slicing the message to part which authErrors object has as key
        let splicedFireAuthMessage = err.message.substring(err.message.indexOf("/") + 1, err.message.indexOf(")"))

        //getting error rewritten for user 
        let userMessage = authErrors[splicedFireAuthMessage as keyof typeof authErrors]

        seterrorMessage(userMessage)
      })
  }

  return (
    <div className='w-full  d-flex justify-content-center align-content-center flex-wrap authBg'>
      <div className='mainAuthContainer bg-light p-5 pt-4 pb-1'>
        <h3 className='pb-2 pr-4 '>Sign in to <br /><strong>traveller's diary</strong></h3>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" value={email} onChange={(e) => { setemail(e.target.value) }} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" value={password} onChange={(e) => { setpassword(e.target.value) }} className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3 form-check">
          <p >No account? <span role="button" className='text-primary' onClick={() => { navigate("register", { replace: true }); }}>Register instead</span> </p>
        </div>
        <button onClick={logIn} className="authActionButton btn  btn-outline-dark">Sign in</button>


        {/* if login failed display this message  */}
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

export default Login