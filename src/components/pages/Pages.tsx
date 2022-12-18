import React, { useState, useEffect } from 'react'
import "./pages.scss";
import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";
import { auth } from "../../firebase"
import GalleryAndMaps from './galleryAndMaps/GalleryAndMaps';

interface pagesProps {
  text: string,
  index: number,
  editMode: boolean,
  images: Blob[],
  changePageTextValue: (newPageText: string) => void,
  changePageImagesValue: (newPageImages: Blob[]) => void
}


const Pages = (props: pagesProps) => {

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
      })
  }, [])


  return (
    <div className='page'>

      <textarea wrap='off' readOnly={!props.editMode} onInput={(e) => {
        props.changePageTextValue(e.currentTarget.value)
      }} className='pageTextarea paper firstPaper text-content'>
        {props.text}
      </textarea>

      <div className='bookbinding'>
      </div>

      <p className="paper secondPaper" >
        <div className="d-flex flex-column">
          <GalleryAndMaps editMode={props.editMode} images={props.images} changeImages={props.changePageImagesValue}></GalleryAndMaps>
        </div>
      </p>
    </div>


  )
}

export default Pages