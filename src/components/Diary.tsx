import React, { useRef, useState, useEffect} from 'react'
import Page from "./page/Page"
import "./diary.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPen, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {db, getDoc, setDoc, doc} from "../firebase"
import {Alert} from 'reactstrap'
import { User } from 'firebase/auth'
import UserControls from "./userControls/UserControls"
import UserIconWithPopover from "./userControls/UserIconWithPopover"


interface Props  {
  editMode:  boolean,
  user: User,
}

const Diary = ({editMode, user} : Props) => {

const diary_pages = useRef<page[]>([])
const [diaryName, setdiaryName] = useState("Diary of smiling pirate")
const [successfullSaveAlertOpen, setsuccessfullSaveAlertOpen] = useState(false)
const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] = useState(false)
const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false)
const [activePageIndex, setactivePageIndex] = useState(0)
const [newPageAlertOpen, setnewPageAlertOpen] = useState(false)

//initial load of data from database
useEffect(() => {
  //initial load of data from database
async function getDataFromDb() {
  try {


    if(user.displayName !== null){
      const docRef = doc(db, "users", user.displayName);
      const docSnap = await getDoc(docRef)

      console.log(user.displayName, "fockin jojoooooooo");
      

      if(docSnap.exists()){

          //the retrieved data
          let diaryDataFromDatabase = docSnap.data();

          console.log('i exist and data got');
          

          if(diaryDataFromDatabase){
            console.log("diaryDataFromDatabase exists :) :P", diaryDataFromDatabase.diary_pages, diaryDataFromDatabase);
            

          setdiaryName(diaryDataFromDatabase.diaryName)
          diary_pages.current = diaryDataFromDatabase.diary_pages
          }
          else{
            console.log("what the fuck why");
            
          }
      }
      else{
        
          await setDoc(docRef, {
            diaryName: user.displayName + "'s diary",
            diary_pages: [
              {editMode: false,
               index: 0,
               page_content: "This is new diary page"
              }
            ],
            username: user.displayName
          });

          const docSnap = await getDoc(docRef)

          //the retrieved data
          let diaryDataFromDatabase = docSnap.data();

          if(diaryDataFromDatabase){
          setdiaryName(diaryDataFromDatabase.diary_name)
          diary_pages.current = diaryDataFromDatabase.diary_pages
          }
          else{
            console.log("what the fuck why");
            
          }
      }
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

    await setDoc(docRef, {diaryName: diaryName, username: user.displayName, diary_pages: diary_pages.current})
    }
}

//timer ID -> used for clearing timeout when the data are saved to early
let saveToDbtimerID : ReturnType<typeof setTimeout>;

async function triggerSave() {
  //clearing timeout of alert display when the data are saved to early from the previous saving
  clearTimeout(saveToDbtimerID)
  await saveToDb()

  //displaying success alert
  setsuccessfullSaveAlertOpen(true)
  saveToDbtimerID = setTimeout(function () {
        setsuccessfullSaveAlertOpen(false)
}, 5000);
  }

async function deletePage(){
  if (diary_pages.current.length > 1 && window.confirm('Are you sure you want to delete this diary page?')) {

  // let diary_pagesCopy = [...diary_pages]
  diary_pages.current.splice(activePageIndex, 1)
  // setdiary_pages(diary_pagesCopy)
  await saveToDb()

  if(activePageIndex !== 0) changePage(-1)
  else changePage(1)


  }
  else if(diary_pages.current.length <= 1){
    window.alert("You can't delete the only page")
  }
}

//timer ID -> used for clearing timeout when the data are saved to early
let createNewDiaryPagetimerID : ReturnType<typeof setTimeout>;

async function createNewDiaryPage() {
  //clearing timeout of alert display when the another new page is created too early from the previous saving
  clearTimeout(createNewDiaryPagetimerID)

  diary_pages.current.push({page_content: "New page content", index: diary_pages.current.length, editMode: false
  })
  
  await saveToDb()
  changePage(+1)
  setnewPageAlertOpen(true)

  saveToDbtimerID = setTimeout(function () {
    setnewPageAlertOpen(false)
}, 5000);
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

function changePageValue(pageContent : string, index :number) {
  diary_pages.current[index] = {page_content: pageContent, index, editMode: false}
}

function changePage (numToChangeIndex: number){
  setactivePageIndex(activePageIndex + numToChangeIndex)
}

interface page {
  page_content: string,
  page_newly_added?: boolean,
  index: number,
  editMode: boolean
}

  const openPage = diary_pages.current[activePageIndex]


  console.log(diary_pages.current, activePageIndex, "ONLY GET ONE SHOT");
  

  return (
    <div className='app'>
        <h1 className='title'>{diaryName}</h1>
        <UserIconWithPopover triggerWrongUserPicUrlAlert = {triggerWrongUserPicUrlAlert} triggerChangeProfileAlert = {triggerChangeProfileAlert}
        user =  {user} ></UserIconWithPopover>

        {diary_pages.current[activePageIndex] !== undefined ? <Page  editMode = {editMode} page_content = {openPage.page_content}
             key = {"page" + openPage.index} index = {activePageIndex} changePageValue = {changePageValue}/>
        :
        <FontAwesomeIcon className = "spinningIcon" role="button" color="black" size = "lg"  icon={faSpinner} />
        }
        <UserControls deletePage = {deletePage} createNewPage = {createNewDiaryPage} changePage={changePage} diary_pagesLength={diary_pages.current.length} activePageIndex = {activePageIndex} editMode = {editMode} triggerSave = {triggerSave} ></UserControls>

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

export default Diary