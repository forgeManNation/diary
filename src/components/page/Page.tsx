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
















// bin of how how it was suposed to look before
//   function convertSecondsToDate (seconds : number){
//     const t = new Date(1970, 0, 1); // Epoch
//     t.setSeconds(seconds);
//     return t;
//   }

//   function zoomPage (){
//     setpageZoomed(!pageZoomed)
//   }

// const pageLarge  = <div onClick={zoomPage} className = " pageLargeBackground">

//   <div className='pageLarge' onClick={(event) => event.stopPropagation()}>
//   <div className=' parchment'></div>

//     <div className='textContent'>
//       <h1 className = "editableText" >
//         {props.editMode ?
//         <EditText onChange={(e) => {setpageName(e.target.value)}} value={pageName} />
//         : pageName}
//        </h1>
//       <h3 className = "editableText" >
//         {props.editMode ? <EditText onChange={(e) => {setpagePerex(e.target.value)}} value={pagePerex} />
//         : pagePerex
//         }
//         </h3>
//       <div className = "editableText" >
//         <div className='editableTextArea'>
//           {props.editMode ? <EditTextarea rows={15} onChange={(e) => {setpageContent(e.target.value)}} value={pageContent} /> : pageContent}
//         </div>
//       </div>
//       {/* uncomment after continuing to work on page */}
//       {/* <GeolocationSegment></GeolocationSegment>
//       <DateSegment></DateSegment> */}
//       <p onClick={zoomPage} className='returnButton'><FontAwesomeIcon icon={faAngleLeft} /> return</p>
//     </div>
//   </div>
// </div>

// const pageBasic = <div onClick={zoomPage} className='col-xs-6 col-sm-5 col-md-4 col-lg-3 page'>
// {props.editMode ? <FontAwesomeIcon className='trashIcon' onClick={() => {props.deletePage(props.index)}}  icon={faTrash} />  : <></>}

// <div className='parchment'></div>
// <div className='textContent'>
// <h2>{props.page_name}</h2>
// <hr></hr>
// <p>{props.page_perex}</p>
// <p>on the {String(convertSecondsToDate(props.page_creation_timestamp.seconds))}</p>
// </div>
// </div>