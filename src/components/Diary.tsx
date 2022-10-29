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
import { storage, ref, uploadBytes, getBlob } from "../firebase";



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
const [diaryPages, setdiaryPages] = useState<page[]>([])

const [diaryName, setdiaryName] = useState("Diary of smiling pirate")
// const [images, setimages] = useState<Blob[]>([])
const [successfullSaveAlertOpen, setsuccessfullSaveAlertOpen] = useState(false)
const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] = useState(false)
const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false)
const [activePageIndex, setactivePageIndex] = useState(0)
const [newPageAlertOpen, setnewPageAlertOpen] = useState(false)


const defaultUserName = 'adventurer'
const newUserFirstDiaryPage = {
  pageContent: "This is your first diary page :) write as you wish",
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
            diaryPages: [newUserFirstDiaryPage],
            username: user.displayName
          });
          
          docSnap = await getDoc(docRef)
        }
        
        //the retrieved data form database
        let diaryDataFromDatabase = docSnap.data();    

        console.log('log me diary pages', diaryDataFromDatabase);
        
        if(diaryDataFromDatabase){
          setdiaryName(diaryDataFromDatabase.diaryName)
          setdiaryPages(diaryDataFromDatabase.diaryPages)
          

          let diaryDataFromDatabaseWithImagesFromFireStorage = diaryDataFromDatabase.diaryPages.map((diaryPage: {textContent: string}) => {
            console.log(diaryPage, 'herein i am logging the text content :)');
            let diaryPageCopy : {textContent: string, images?: Blob[]} = diaryPage;

            //handling fire storage image fetching
            const storageRef = ref(storage, `/${user.email}/page${activePageIndex}/image${0}`);

            getBlob(storageRef).then(image => {
              diaryPageCopy.images = [image];
            })
            .catch(err => {
              console.log(err, "tu loguju error");
              
            })

            return diaryPageCopy;
          })

          console.log(diaryPages);
          
          

        }
        else{
          alert('could not retrieve data from database')
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
    
    if(diaryPages.length !== 0){
      const diaryPagesCopy = [...diaryPages]
      diaryPagesCopy.forEach((page, index) => {
        //handling fire storage saving
        const storageRef = ref(storage, `/${user.email}/page${activePageIndex}/image${index}`);
        console.log(page, 'log me page');
        
        uploadBytes(storageRef, page.images[index]).then((snapshot) => {
          alert('Uploaded a blob or file!');
        });
      })
    }
    else{
      console.log('no images to show');
    }
    const diaryPagesTextContents = diaryPages.map(diaryPage => diaryPage.pageContent)

    await setDoc(docRef, {diaryName: diaryName, username: user.displayName, diaryPages: diaryPagesTextContents})
    }
}


async function save(){
  await saveToDb()
  triggerSaveAlert()
}

function deletePage(){
  if (diaryPages.length > 1 && window.confirm('Are you sure you want to delete this diary page?')) {
  // let diaryPagesCopy = [...diaryPages]
  const diaryPagesCopy = [...diaryPages]
  diaryPagesCopy.splice(activePageIndex, 1)
  // setdiaryPages(diaryPagesCopy)
  saveToDb()

  if(activePageIndex !== 0) changePage(-1)
  else changePage(1)


  }
  else if(diaryPages.length <= 1){
    window.alert("You can't delete the only page")
  }
}

async function createNewPage() {
  const diaryPagesCopy = [...diaryPages]
  diaryPagesCopy.push({pageContent: "New page content", images: []})
  setdiaryPages(diaryPagesCopy)
  await saveToDb()
  changePage(+1)
  triggerCreateNewDiaryPageAlert()  
}



function changePageValue(pageContent : string, images: Blob[], index :number) {
  
  console.log('so here i am setting images as this', images);
  const diaryPagesCopy = [...diaryPages]
  diaryPagesCopy[index] = {pageContent: pageContent, images: images}
  setdiaryPages(diaryPagesCopy)

  console.log(diaryPages, "wau");
  
}

function changePage (numToChangeIndex: number){
  setactivePageIndex(activePageIndex + numToChangeIndex)
}



interface page {
  pageContent: string,
  images: Blob[]
  // map_view_coordinates: LatLng,
  // map_zoom: number,
  // map_marker_coordinates: LatLng,
}

  //page that is open right now
  const openPage = diaryPages[activePageIndex]



  return (
    <div className='app'>
        {/* <h1 className='title'>{diaryName}</h1> */}

        <UserIconWithPopover triggerWrongUserPicUrlAlert = {triggerWrongUserPicUrlAlert} 
        triggerChangeProfileAlert = {triggerChangeProfileAlert}
        user =  {user} ></UserIconWithPopover>

        {diaryPages[activePageIndex] !== undefined ? <Page editMode = {editMode} pageContent = {openPage.pageContent}
             key = {"page" + activePageIndex} index = {activePageIndex} changePageValue = {changePageValue}  images =  {openPage.images}/>
        :
        <FontAwesomeIcon className = "spinningIcon  fa-spin" role="button" color="black" size = "lg"  icon={faArrowsSpin} />
        }
        <UserControls deletePage = {deletePage} createNewPage = {createNewPage} changePage={changePage} diaryPagesLength={diaryPages.length} activePageIndex = {activePageIndex} editMode = {editMode} save = {save} ></UserControls>

    </div>

  )
}

export default Diary