import React from 'react'
import Page from "./components/page/Page"
import "./app.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
const App = () => {

//Setting our host URL as a constant for easy reference
const URL = "http://localhost:3000"
//We will probably not talk much about options this article, but here is an example one
// options = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ dataKey1: dataValue1, dataKey2: dataValue2 }),
//     };

//This is the actual series of functions for a fetch request. 
//However, the above options and URL are just examples of possible text
//This series of code would actually be inneffective in practice 
//so we are focusing on the structure rather than specific content.
fetch('http://localhost:3000/mytest')
.then(response=>(response.json()))
.then(json=>(console.log(json)))


fetch('http://localhost:3000/mytest', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({text: 'Some string: sidvm'})
}).then(res => res.json())
  .then(res => console.log(res));


  return (
    <div className='app'>
        <h1 className='title'>Diary of smiling pirate</h1>
        <p className='user'>
            <FontAwesomeIcon icon={faUser} />
            <i className='fa-solid fa-user'></i>
            &nbsp;
          pfiffierfnreiofnvbhdblhljhb
        </p>
        <div className='container'>
            <div className='row'>
                <Page/>
                <Page/>
                <Page/>
                <Page/>
            </div>
        </div>
    </div>
    


  )
}

export default App