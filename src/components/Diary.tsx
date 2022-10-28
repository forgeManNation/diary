import React, { useRef, useState, useEffect} from 'react'
import Page from "./page/Page"
import "./diary.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowsSpin} from '@fortawesome/free-solid-svg-icons'
import {db, getDoc, setDoc, doc} from "../firebase"
import {Alert} from 'reactstrap'
import { User } from 'firebase/auth'
import UserControls from "./userControls/UserControls"
import UserIconWithPopover from "./userControls/UserIconWithPopover"
import { LatLng } from 'leaflet'
import { storage, ref, uploadBytes } from "../firebase";



interface Props  {
  editMode:  boolean,
  user: User,
  triggerWrongUserPicUrlAlert: () => void,
  triggerChangeProfileAlert: () => void,
  triggerCreateNewDiaryPageAlert: () => void,
  triggerSaveAlert: () => void
}

const Diary = ({editMode, user, triggerWrongUserPicUrlAlert, triggerChangeProfileAlert, triggerCreateNewDiaryPageAlert,
  triggerSaveAlert} : Props) => {


//all of the diary content is stored in this array
const diary_pages = useRef<page[]>([])

const [diaryName, setdiaryName] = useState("Diary of smiling pirate")
// const [images, setimages] = useState<Blob[]>([])
const [successfullSaveAlertOpen, setsuccessfullSaveAlertOpen] = useState(false)
const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] = useState(false)
const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false)
const [activePageIndex, setactivePageIndex] = useState(0)
const [newPageAlertOpen, setnewPageAlertOpen] = useState(false)


const defaultUserName = 'adventurer'
const newUserFirstDiaryPage = {
  page_content: "This is your first diary page :) write as you wish",
  images: []
 }  

//initial load of data from firestore database
useEffect(() => {
  //initial load of data from firestore database
  async function getDataFromDb() {
    try {

      //TODO: find out whether this measure is good enough
      //if user is authenticated
      if(user.email){
        const docRef = doc(db, "users", user.email);
        let docSnap = await getDoc(docRef)
        
        //if user does not have a firestore database create new firestore database  
        if(!docSnap.exists()){    
          await setDoc(docRef, {
            diaryName: (user.displayName ? user.displayName : defaultUserName) + "'s diary",
            diary_pages: [newUserFirstDiaryPage],
            username: user.displayName
          });
          
          docSnap = await getDoc(docRef)
        }
        
        //the retrieved data form database
        let diaryDataFromDatabase = docSnap.data();    

        if(diaryDataFromDatabase){
          setdiaryName(diaryDataFromDatabase.diaryName)
          diary_pages.current = diaryDataFromDatabase.diary_pages
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
    //handling firestore saving
    const docRef = doc(db, "users", user.displayName);
    
    if(diary_pages.current.length !== 0){
      diary_pages.current.forEach((page, index) => {
        //handling fire storage saving
        const storageRef = ref(storage, '/testovani/image' + index);
        console.log(page, 'log me page');
        
        uploadBytes(storageRef, page.images[index]).then((snapshot) => {
          alert('Uploaded a blob or file!');
        });
      })
    }
    else{
      console.log('no images to show');
    }

    await setDoc(docRef, {diaryName: diaryName, username: user.displayName, diary_pages: diary_pages.current})
    }
}


async function save(){
  await saveToDb()
  triggerSaveAlert()
}

function deletePage(){
  if (diary_pages.current.length > 1 && window.confirm('Are you sure you want to delete this diary page?')) {
  // let diary_pagesCopy = [...diary_pages]
  diary_pages.current.splice(activePageIndex, 1)
  // setdiary_pages(diary_pagesCopy)
  saveToDb()

  if(activePageIndex !== 0) changePage(-1)
  else changePage(1)


  }
  else if(diary_pages.current.length <= 1){
    window.alert("You can't delete the only page")
  }
}

async function createNewPage() {
  diary_pages.current.push({page_content: "New page content", images: []})
  await saveToDb()
  changePage(+1)
  triggerCreateNewDiaryPageAlert()  
}



function changePageValue(page_content : string, images: Blob[], index :number) {
  
  console.log('so here i am setting images as this', images);
  
  diary_pages.current[index] = {page_content: page_content, images: images}

  console.log(diary_pages.current, "wau");
  
}

function changePage (numToChangeIndex: number){
  setactivePageIndex(activePageIndex + numToChangeIndex)
}



interface page {
  page_content: string,
  images: Blob[]
  // map_view_coordinates: LatLng,
  // map_zoom: number,
  // map_marker_coordinates: LatLng,

}

  //page that is open right now
  const openPage = diary_pages.current[activePageIndex]

  //TODO: remove ASAP
  if(openPage){
  console.log(openPage, "images v diary", openPage.images);
  }
  


  return (
    <div className='app'>
        {/* <h1 className='title'>{diaryName}</h1> */}

        <UserIconWithPopover triggerWrongUserPicUrlAlert = {triggerWrongUserPicUrlAlert} 
        triggerChangeProfileAlert = {triggerChangeProfileAlert}
        user =  {user} ></UserIconWithPopover>

        {diary_pages.current[activePageIndex] !== undefined ? <Page editMode = {editMode} page_content = {openPage.page_content}
             key = {"page" + activePageIndex} index = {activePageIndex} changePageValue = {changePageValue}  images =  {openPage.images}/>
        :
        <FontAwesomeIcon className = "spinningIcon  fa-spin" role="button" color="black" size = "lg"  icon={faArrowsSpin} />
        }
        <UserControls deletePage = {deletePage} createNewPage = {createNewPage} changePage={changePage} diary_pagesLength={diary_pages.current.length} activePageIndex = {activePageIndex} editMode = {editMode} save = {save} ></UserControls>

    </div>

  )
}

export default Diary