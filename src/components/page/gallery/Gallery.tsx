import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faImage } from '@fortawesome/free-solid-svg-icons'
import "./gallery.scss"

const Gallery = () => {

    const [images, setimages] = useState<File[]>([]);

    function addImage (){

    }


  return (
    <div>
        <div className='gallery'>
        
        {images.map((image : File, index) => <div  className='galleryImageContainer'  key={'image' + index}>
            <img alt="gallery item" className='galleryImage'  width={"250px"} src={URL.createObjectURL(image)} />
            <span className='galleryImageTape'></span>
            <br />
          </div>
        )}

        <input
              id='upload'
              className='hiddenInput'
              type="file"
              name="myImage"
            
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                console.log('i should be triggered');
                
                if(event.target.files !== null) {
                  setimages([...images, event.target.files[0]]);
              }
              }}
        />
        <label htmlFor="upload">
            {/* add image icon */}
            <div className='btn  addAdditionalFeatureButton'>
            <FontAwesomeIcon  icon={faImage}></FontAwesomeIcon>
            &nbsp;
            Add picture
            </div>
            
        </label>

        
        
        </div>

        
    </div>
    
  )
}

export default Gallery