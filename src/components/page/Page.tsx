import React, { useState, useEffect, useRef, useCallback } from 'react'
import "./page.scss";
import { faImage, faFileImage, faPlus, faRectangleAd, faAdd, faRectangleList, faPlusSquare, faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import { auth } from "../../firebase"
import Images from './images/Images';

interface pageProps {
  text: string,
  index: number,
  editMode: boolean,
  images: Blob[],
  changePageTextValue: (newPageText: string) => void,
  changePageImagesValue: (newPageImages: Blob[]) => void
}


const Page = (props: pageProps) => {

  const [galleryPictures, setgalleryPictures] = useState<string[]>([])

  useEffect(() => {

    // Create a root reference
    const storage = getStorage();

    // Create a reference to images folder
    const userImagesRef = ref(storage, `/${auth.currentUser?.displayName}`);

    listAll(userImagesRef).then(res => {
      res.items.forEach(resp => {

        getDownloadURL(resp).then((url: string) => {
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

      <textarea readOnly={!props.editMode} onInput={(e) => {
        props.changePageTextValue(e.currentTarget.value)
      }} className='pageTextarea paper firstPaper text-content'>
        {props.text}
      </textarea>

      <div className='bookbinding'>
      </div>

      <p className="paper secondPaper" >

        {props.editMode ?
          <div className="d-flex flex-column">
            <Images images={props.images} changeImages={props.changePageImagesValue}></Images>


          </div>
          :
          <></>
        }


      </p>


    </div>


  )
}

export default Page