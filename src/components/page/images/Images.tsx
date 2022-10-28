import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faImage } from '@fortawesome/free-solid-svg-icons'
import "./images.scss"
import ModalAddGeolocation from "./ModalAddGeolocation"
import { LatLng } from 'leaflet'

interface imagesProps {
  images: Blob[],
  changeImages: (newImages: Blob[]) => void
}

const Images = (props: imagesProps) => {

    // const [images, setimages] = useState<Blob []>();
    const [modalAddGeolocationOpen, setmodalAddGeolocationOpen] = useState(false)

    function triggerModalAddGeolocationOpen (){
      setmodalAddGeolocationOpen(!modalAddGeolocationOpen)
    }

    // console.log(images, "these are the images", props.images);
      
    const images = props.images ? props.images : []
    console.log(images, "here i am logging images :) nother time", props.images, "jjoooo  ");
    
  return (
    <div>
        <div className='gallery'>
        
        {images.map((image : Blob, index) => <div  className='galleryImageContainer'  key={'image' + index}>
            <img alt="gallery item" className='galleryImage'  width={"250px"} src={URL.createObjectURL(image)} />
            <span className='galleryImageTape'></span>
            <br />
          </div>)
        }


        {/* for uploading end users files - pictures */}
        <input
              id='upload'
              className='hiddenInput'
              type="file"
              name="myImage"
            
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
                //if user selected image add it to array               
                if(event.target.files !== null) {
                  
                  props.changeImages([...images, event.target.files[0]]);
              }
              }}
        />
        

        {/* letting user to create a map */}
        <div>
       
        </div>
        {/* get Zoom, mapLatLng, markerLatLng  */}
        <ModalAddGeolocation addMap = {(newMapBlob) => {props.changeImages([...images, newMapBlob])}}  triggerModalAddGeolocationOpen = {triggerModalAddGeolocationOpen} modalAddGeolocationOpen = {modalAddGeolocationOpen}></ModalAddGeolocation>

        
        <div className="addImagesActionButtons">
          <div className='addImagesActionButtonsInnerContainer'>
            <button onClick = {triggerModalAddGeolocationOpen} className=" btn addAdditionalFeatureButton"> 
                    <FontAwesomeIcon  icon={faMap}  />
                    &nbsp;
                    Add map
            </button>
            
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

        
        
        </div>
  
    </div>
    
  )
}

export default Images