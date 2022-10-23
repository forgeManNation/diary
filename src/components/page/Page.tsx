import React, {useState, useEffect, useRef, useCallback} from 'react'
import "./page.scss";
import {faImage, faFileImage, faPlus, faRectangleAd, faAdd, faRectangleList, faPlusSquare, faMap} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import {auth} from "../../firebase"
import Gallery from "./gallery/Gallery"
import Map from "./map/Map"

interface pageProps {
  page_content: string,
  index: number,
  changePageValue: (pageContent : string, index :number) => void,
  editMode: boolean
}

const Page = (props : pageProps) => {

  const [galleryPictures, setgalleryPictures] = useState<string[]>([])
  
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


 


  return (
  <div className='page'>
  <p className="paper firstPaper text-content" contentEditable= {props.editMode} suppressContentEditableWarning={true}
  onInput={(e) => {
    if(e.currentTarget.textContent) props.changePageValue(e.currentTarget.textContent, props.index)
    }}>
      {props.page_content}
  </p>

  <div className='bookbinding'>
  </div>

  <p className="paper secondPaper" >

    {props.editMode ?
      <div className = "d-flex flex-column">
      <Gallery></Gallery>
      <Map></Map>
      

      </div>
      :
      <></>
    }

 
  </p>


  </div>


  )
}

export default Page