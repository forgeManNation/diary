import React from 'react'
import Page from "./page/Page"
import "./diary.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencil} from '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from "react"
import {db, getDoc, setDoc, doc} from "../firebase"
import {Alert} from 'reactstrap'
import { User } from 'firebase/auth'
import UserControls from "./userControls/UserControls"


interface Props  {
  editMode:  boolean,
  changeEditMode: (changeEditModeToOn: boolean) => void,
  changeUser: (user: User | null) => void,
  user: User,
}

const Diary = ({editMode, changeEditMode, changeUser, user} : Props) => {

const [diaryPages, setdiaryPages] = useState <page[]>([])
const [diaryName, setdiaryName] = useState("Diary of smiling pirate")
const [successAlertOpen, setsuccessAlertOpen] = useState(false)
const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] = useState(false)
const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false)


function deletePage(index:number) {
  let diaryPagesCopy = [...diaryPages]
  diaryPagesCopy.splice(index, 1)
  setdiaryPages(diaryPagesCopy)
}

useEffect(() => {
  //iniitial load of data from database
async function getDataFromDb() {
  try {
    const docRef = doc(db, "users", "forge");
    const docSnap = await getDoc(docRef)

    //the retrieved data
    let diaryDataFromDatabase = docSnap.data();
  
    if(diaryDataFromDatabase){
    setdiaryName(diaryDataFromDatabase.diary_name)
    setdiaryPages(diaryDataFromDatabase.diary_pages)
    }

  } catch (error) {
    console.log(error); 
  } 
  }
  getDataFromDb()
  
}, [])


async function saveToDb() {
  if(user.displayName){
    const docRef = doc(db, "users", user.displayName);
    await setDoc(docRef, {diary_name: diaryName, username: "updated_forge", diary_pages: diaryPages})
    }
}

//timer ID -> used for clearing timeout when the data are saved to early
let saveToDbtimerID : ReturnType<typeof setTimeout>;

async function triggerSave() {
  //clearing timeout of alert display when the data are saved to early from the previous saving
  clearTimeout(saveToDbtimerID)
  await saveToDb()
  
  //displaying success alert
  setsuccessAlertOpen(true)
  saveToDbtimerID = setTimeout(function () {
        setsuccessAlertOpen(false)    
}, 5000);
  }

function createNewDiaryPage() {

  setdiaryPages([...diaryPages, {page_content: "New page content", page_name: "New page name", page_perex: "New page perex", creation_date: {seconds: Math.floor(Date.now() / 1000), nanoseconds: 0},
   page_newly_added: true,  index: diaryPages.length, editMode: false
   }])

  }

//timer ID -> used for clearing timeout when the data are saved to early
let changeProfiletimerID : ReturnType<typeof setTimeout>;
function triggerChangeProfileAlert(){
  clearTimeout(changeProfiletimerID)
setsuccessProfilePictureAlertOpen(true)
changeProfiletimerID = setTimeout(function () {
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

function changePageValue(pageName : string, pagePerex : string, pageContent : string, index :number) {
  let diaryPagesCopy = [...diaryPages]
  diaryPagesCopy[index] = {page_name: pageName, page_perex: pagePerex, page_content: pageContent, creation_date: {seconds: 100, nanoseconds: 544}, index, editMode: false}
  setdiaryPages(diaryPagesCopy)
}

interface page {
  page_name: string,
  page_content: string,
  page_perex: string,
  creation_date: {nanoseconds: number, seconds: number},
  page_newly_added?: boolean,
  index: number,
  editMode: boolean
}

  return (
    <div className='app'>
    {/* filter used for making Page edges rougher*/}
      <svg id='svgWithFilter'>
        <filter id="wavy2">
          <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </svg>

        <h1 className='title'>{diaryName}</h1>
        {/* Buttons on the upper right */}
        <UserControls triggerWrongUserPicUrlAlert = {triggerWrongUserPicUrlAlert} triggerChangeProfileAlert = {triggerChangeProfileAlert} changeUser={changeUser} editMode = {editMode} user =  {user} changeEditMode = {changeEditMode}
        triggerSave = {triggerSave}  ></UserControls>

        <div className='container'>
            <div className='row'>
              {diaryPages.map((page : page, index) => 
                <Page deletePage={deletePage} editMode = {editMode} page_creation_timestamp = {page.creation_date } page_name = {page.page_name} page_content = {page.page_content} page_perex = {page.page_perex} 
                 page_newly_added = {page.page_newly_added} index = {index} changePageValue = {changePageValue}/>)
              }
              <div onClick={createNewDiaryPage} className='col-xs-6 col-sm-4 col-md-3 col-lg-2 d-flex  align-items-center justify-content-center align-center'>
            {editMode ? <FontAwesomeIcon size='2x'  icon={faPencil} /> : <></>}
            </div>
            </div>
        </div>

      <Alert isOpen = {successAlertOpen} toggle = {() => {setsuccessAlertOpen(false)}} color="success">
        Succesfully saved!
      </Alert>

      <Alert isOpen = {successProfilePictureAlertOpen} toggle = {() => {setsuccessProfilePictureAlertOpen(false)}} color="success">
        Profile picture updated!
      </Alert>

      <Alert isOpen = {wrongUserPicAlertOpen} toggle = {() => {setwrongUserPicAlertOpen(false)}} color="danger">
        Can not update profile picture!
      </Alert>


    </div>
    
  )
}

export default Diary