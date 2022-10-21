import React, {useState, useEffect, useRef, useCallback} from 'react'
import "./page.scss";
import {faImage, faFileImage, faPlus, faRectangleAd, faAdd, faRectangleList, faPlusSquare, faMap} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import {auth} from "../../firebase"
import ModalAddGeolocation from "./geolocation/ModalAddGeolocation"
import Gallery from "./gallery/Gallery"

interface pageProps {
  page_content: string,
  index: number,
  changePageValue: (pageContent : string, index :number) => void,
  editMode: boolean
}

const Page = (props : pageProps) => {

  const [galleryPictures, setgalleryPictures] = useState<string[]>([])
  const [modalAddGeolocationOpen, setmodalAddGeolocationOpen] = useState(false)
  useEffect(() => {

// Create a root reference
const storage = getStorage();

// Create a reference to images folder
const userImagesRef = ref(storage, `/${auth.currentUser?.displayName}`);

listAll(userImagesRef).then(res =>
  {
  res.items.forEach(resp => {

      getDownloadURL(resp).then((url : string) => {
        setgalleryPictures([...galleryPictures, url])
      })
  })
  }
)
.catch(error => {
  console.log(error, 'listAll error');
}

)
  }, [])


  function triggerModalAddGeolocationOpen (){
    setmodalAddGeolocationOpen(!modalAddGeolocationOpen)
  }


  return (
  <div className='page'>
  <p className="paper" >
  <p contentEditable= {props.editMode} suppressContentEditableWarning={true}
  onInput={(e) => {
    if(e.currentTarget.textContent) props.changePageValue(e.currentTarget.textContent, props.index)
    }}>

    {props.page_content}

  </p>
  <div className='gallery'>
      {galleryPictures.map((pictureUrl : string) => {
        return <img src = {pictureUrl} alt = "galleryImage"></img>
      })
      }
      {props.editMode ?
      <div className = "d-flex flex-column">
      <Gallery></Gallery>
      <FontAwesomeIcon className='addImage' icon={faMap} onClick = {triggerModalAddGeolocationOpen} />
      <ModalAddGeolocation triggerModalAddGeolocationOpen = {triggerModalAddGeolocationOpen} modalAddGeolocationOpen = {modalAddGeolocationOpen}></ModalAddGeolocation>

      </div>
      :
      <></>
      } 
        
  </div>
  </p>


  </div>


  )
}

export default Page