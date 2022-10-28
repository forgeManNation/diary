import React, {useState, useEffect, useRef, useCallback} from 'react'
import "./page.scss";
import {faImage, faFileImage, faPlus, faRectangleAd, faAdd, faRectangleList, faPlusSquare, faMap} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import {auth} from "../../firebase"
import Images from './images/Images';

interface pageProps {
  page_content: string,
  index: number,
  changePageValue: (pageContent : string, images: Blob[], index :number) => void,
  editMode: boolean,
  images: Blob[],
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


interface changeValueProps {
  textContent?: string,
  images?: Blob[],
  index: number
} 

function triggerChangePageValue ({textContent, images, index} : changeValueProps) {

  let newTextContent = textContent ? textContent : props.page_content;
  let newImages = images ? images : props.images;
  
  console.log('here imaages are this in page', newImages);
  
  props.changePageValue(newTextContent, newImages, index)

}
 
  //TODO: remove ASAP
  console.log('images v page', props.images);
  

  return (
  <div className='page'>
  <p className="paper firstPaper text-content" contentEditable= {props.editMode} suppressContentEditableWarning={true}
  onInput={(e) => {
    //TODO: refactor ASAP 
    // if(e.currentTarget.textContent) props.changePageValue(e.currentTarget.textContent, props.index)
    triggerChangePageValue({textContent: e.currentTarget.textContent ? e.currentTarget.textContent : undefined, index: props.index})
    }}>
      {props.page_content}
  </p>

  <div className='bookbinding'>
  </div>

  <p className="paper secondPaper" >

    {props.editMode ?
      <div className = "d-flex flex-column">
      <Images images = {props.images} changeImages = {(newImages) => {triggerChangePageValue({images: newImages, index: props.index})}}></Images>
      

      </div>
      :
      <></>
    }

 
  </p>


  </div>


  )
}

export default Page