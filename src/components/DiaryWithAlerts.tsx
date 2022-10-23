import React, { useRef, useState, useEffect} from 'react'
import "./diary.scss"
import {Alert} from 'reactstrap'
import { User } from 'firebase/auth'
import Diary from "./Diary"



interface Props  {
  editMode:  boolean,
  user: User,
}

const DiaryWithAlerts = ({editMode, user} : Props) => {

const [successfullSaveAlertOpen, setsuccessfullSaveAlertOpen] = useState(false)


// const [messages, setmessages] = useState[]<timeRemaining>(0)


// useEffect(()=>{
//         const interval = setInterval(()=>{
//           setMessages(prev=>prev.filter(i=>i.timeRemaining>0).map((item)=>{
//             return {
//               ...item, timeRemaining: item.timeRemaining - 1
//             }
//           }))
//         },1000)
//         return ()=> clearInterval(interval)
//       },[])


const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] = useState(false)
const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false)
const [newPageAlertOpen, setnewPageAlertOpen] = useState(false)

 
//timer ID -> used for clearing timeout when the data are saved to early
let saveToDbAlerttimerID : ReturnType<typeof setTimeout>;

function triggerSaveAlert() {
  //clearing timeout of alert display when the data are saved to early from the previous saving
  clearTimeout(saveToDbAlerttimerID)

  //displaying success alert
  setsuccessfullSaveAlertOpen(true)
  saveToDbAlerttimerID = setTimeout(function () {
        setsuccessfullSaveAlertOpen(false)
  }, 5000);  
}


//timer ID -> used for clearing timeout when the data are saved to early
let triggerCreateNewDiaryPageAlerttimerID : ReturnType<typeof setTimeout>;
function triggerCreateNewDiaryPageAlert() {
        
        //clearing timeout of alert display when the another new page is created too early from the previous saving
        clearTimeout(triggerCreateNewDiaryPageAlerttimerID)
        setnewPageAlertOpen(true)

        saveToDbAlerttimerID = setTimeout(function () {
                setnewPageAlertOpen(false)
        }, 5000);
}


//timer ID -> used for clearing timeout when the data are saved to early
let changeProfileAlerttimerID : ReturnType<typeof setTimeout>;
function triggerChangeProfileAlert(){
        
        clearTimeout(changeProfileAlerttimerID)
        setsuccessProfilePictureAlertOpen(true)
        changeProfileAlerttimerID = setTimeout(function () {
                setsuccessProfilePictureAlertOpen(false)
        }, 5000);
}


//timer ID -> used for clearing timeout when the data are saved to early
let changeWrongUserPicID : ReturnType<typeof setTimeout>;
function triggerWrongUserPicUrlAlert () {
  clearTimeout(changeWrongUserPicID)
  setwrongUserPicAlertOpen(true)
  changeWrongUserPicID = setTimeout(function () {
    setwrongUserPicAlertOpen(false)
  }, 5000);
}




  return (
    <div>

      <Diary editMode = {editMode} user = {user} 
      triggerSaveAlert = {triggerSaveAlert} triggerCreateNewDiaryPageAlert = {triggerCreateNewDiaryPageAlert}
      triggerChangeProfileAlert = {triggerChangeProfileAlert} triggerWrongUserPicUrlAlert = {triggerWrongUserPicUrlAlert}
      />

      <div className='alertBox'>
      <Alert className='alert' isOpen = {successfullSaveAlertOpen} toggle = {() => {setsuccessfullSaveAlertOpen(false)}} color="success">
        Succesfully saved!
      </Alert>

      <Alert className='alert' isOpen = {newPageAlertOpen} toggle = {() => {setnewPageAlertOpen(false)}} color="success">
        New page created!
      </Alert>

      <Alert className='alert' isOpen = {successProfilePictureAlertOpen} toggle = {() => {setsuccessProfilePictureAlertOpen(false)}} color="success">
        Profile picture updated!
      </Alert>

      <Alert className='alert' isOpen = {wrongUserPicAlertOpen} toggle = {() => {setwrongUserPicAlertOpen(false)}} color="danger">
        Can not update profile picture!
      </Alert>
      </div>
    </div>

  )
}

export default DiaryWithAlerts