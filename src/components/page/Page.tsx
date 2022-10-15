import React, {useState, useEffect, useRef, useCallback} from 'react'
import "./page.scss";
import {faImage, faFileImage, faPlus, faRectangleAd, faAdd, faRectangleList, faPlusSquare, faMap} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import {auth} from "../../firebase"
import ModalAddGeolocation from "./geolocation/ModalAddGeolocation"

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
    console.log('ehm what? does useEffect runs more times');
    console.log("hey what the fuck is happening there? :D");
    

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
  console.log(error, 'I am saying error you mate :)');

}

)
  }, [])


  function triggerModalAddGeolocationOpen (){
    setmodalAddGeolocationOpen(!modalAddGeolocationOpen)
  }


  return (
  <div className='page'>
  <p className="paper" >
  <p contentEditable= {props.editMode}
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
      <img alt='addImage'  className='addImage' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAAFMklEQVR4nO2dy2tdRRyAv6oktyXVFhfa+NhIUlDbpCltIm5q0J1/geJOrAimK/vAha2uRLG2gi/0H1DQSpEiKG5VpDa1ZiG4an1gbaukYG4i97r43aO36Zm58zhnzpyT+eBHIPfcOb/5MszjzNwbSCQSiUQikUgkEolEIpFIJBKJxABawD7ga+Aq0E1Bt+fiK2AOGHa22+NOYD6CSsUeZ3qunGiRJNvKdmrZ+yJIvm7xrErmDRrRj2leS+SjdLZO86ZFYKT4XBrNVWBj3gs60d1ycmk8uU51XUeiQJLoQCTRwhJwDJhGxqURYAY4DrTLvnnVU6VQcR7YrvEw0bvGtDxrqhYQIv5GLzljAmn1SbRjvG7h47hhmdZULSFE7LbwMWNYZi5rfR69EVlkmDCCLOIGkebRnni5Wuui7y3p2utY66IfL+laK6oeqELEEjJ1G8QksnBxHgx1VC0hVJxHL3sSuGBRnjVVCwgZS8g8eYb/l+APAG9g3pIrFf0zcBBpMVkFJoFDwC8RCC4jgot+D9igKX8D8H4EYmot+rDFfQ6XWOlGi37B4V4HPCsXU1gTSnJGU2RbE1JyRhNk53KTj5U+jvTCl5eB9RTzR9PRRQ68fNv7eQ74DfirF21gE3AzcBcwBuxApnxTFLyiNv0L2gx8ppQxQHaAz4GngVGP3G4F9gLfKO5jTVWSM4qSvYRMI+8rIccJ4E2uXdRY49wfFYiv7A+BuwPkOQ58Qo1Fg5vsn4BHAuXXz8Mub4pFNNjNRk4CmwPm5k1MomFwy+4Az6PfnutnGHgIeBH4GFgALgPLSJ97Gfih99oRYA8FHDjPIzbRoJbdAZ4xLGMn8C7wp6IsXVwB3kGmeIURo2i4XnYHeNLgfVPAZ9jLVcUp5EmkN7GKhmtlvzTg2vXIca9/KE5yFivAUeTTEc7ELBpE9gn0q7StwFmKF7w6ziCrRydiFw0wpHltGviD8iVncRG7Azn/UQfRKqaRwy6hJGexiIPsuoreStiWnNeyrbqROopuAd9RneQsziKDsBF1FH0Mdzlt4DlgSy/2Y78D3h+vmSZdN9FT+E3h9ueU6bMRsYLZ4ZzaifZdjGzJKfN2zzI/NUm8TqJ34idEVxefMjvIzkxjDjnurToBBeuApwZdVJcWPYzbA6IQLbqLPAUcakKLfhC4peokNGwGZpogek/VCRgw2wTRRlOoitnuK9q3/7KJcUUOJsvdZWSePIoMUHmhQnX9KDLPXja4vyp3IKxEk7hNkafJc428xUhRmCxqLuoKqFrs6lDt15ksk/MWI0VhsqhZ0nUdpp+/qwOmG7Yu3GhykU70QkGJFMUmxe9NPmT5RJGJOJStzXGO6ruL/lANKAsG720jfanPmbvVZIOhSdd1TlfQMLIXVrXgLGYVeZ4oqHwVRZT9ka7raAOPIt99FwP3K34fS3465gfNoy8g+29zyNdDVjlAqkR/GTQLN+qQ40CGkRNEsXYdl2jIQ6U2cjw3Vj7AbPVYC6aIs0V3KOjYWEycwk9K3tTvDs8yTxZeywiYRDZEXaUcyCnzoEd5K8C2wmsZCUdxF9O/qLFZjKjilZLrWikt4DT+/bVvzGNxgKaujCGPJauS/DtwT+m1jITdVHfIcVeA+kXFLqR1hZJ8Cflk7ZpkjDAPxk6zhroLFS3kwKHP1E8VK8CreH60omlMIGfhOvgL7iCLkcbOk4tgB/A2coLIpR9+C4dldZl7abEzhHwr2Czy1cbjyEZr9s8QFoFfgR+B74EvkP+u5PSA6F+iIt8t7A49qQAAAABJRU5ErkJggg=="/>
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