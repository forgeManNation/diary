import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faImage, faMapLocation} from '@fortawesome/free-solid-svg-icons'
import "./gallery.scss"
import ModalAddGeolocation from "./ModalAddGeolocation"
import { LatLng } from 'leaflet'

interface galleryProps {
  images: Blob[],
  changeImages: (newImages: Blob[]) => void,
  editMode: boolean;
}

const Gallery = (props: galleryProps) => {

  const [modalAddGeolocationOpen, setmodalAddGeolocationOpen] = useState(false)

  function triggerModalAddGeolocationOpen() {
    setmodalAddGeolocationOpen(!modalAddGeolocationOpen)
  }

  function removeGalleryItem(indexToRemove: number) {
    if (props.editMode && window.confirm("Do you want to delete this image?")) {
      images.splice(indexToRemove, 1);
      props.changeImages(images);
    }
    else if (!props.editMode) {
      alert("to delete the image, you have to turn on edit mode first")
    }
  }


  const images = props.images ? props.images : []

  return (
    <div>
      <div className='gallery'>

      {/* <i className="bi bi-plus-circle-dotted"></i> */}


        {images.map((image: Blob, index) => <div className='galleryImageContainer' key={'image' + index}>
          <img alt="gallery item" className='galleryImage' width={"250px"} src={URL.createObjectURL(image)} />
          <span className='galleryImageTape' onClick={() => { removeGalleryItem(index) }}></span>
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
            if (event.target.files !== null) {

              props.changeImages([...images, event.target.files[0]]);
            }
          }}
        />



        {props.editMode ?
          <div className="addImagesActionButtons">
            <div className='addImagesActionButtonsInnerContainer'>
              {/* <button onClick={triggerModalAddGeolocationOpen} className=" btn addAdditionalFeatureButton">
                <FontAwesomeIcon icon={faMap} />
                &nbsp;
                Add map
              </button> */}
              {/* <i className="bi bi-map  addAdditionalFeatureButton" onClick={triggerModalAddGeolocationOpen}></i> */}
              <FontAwesomeIcon className='addAdditionalFeatureButton' icon={faMapLocation}  onClick={triggerModalAddGeolocationOpen}></FontAwesomeIcon>
              {/* get Zoom, mapLatLng, markerLatLng  */}
              <ModalAddGeolocation addMap={(newMapBlob) => { props.changeImages([...images, newMapBlob]) }} triggerModalAddGeolocationOpen={triggerModalAddGeolocationOpen} modalAddGeolocationOpen={modalAddGeolocationOpen}></ModalAddGeolocation>

              <label htmlFor="upload">
                {/* add image icon */}
                {/* <div className='btn  addAdditionalFeatureButton'>
                  <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
                  &nbsp;
                  Add picture
                </div> */}
                <FontAwesomeIcon icon={faImage} className = "addAdditionalFeatureButton" onClick={triggerModalAddGeolocationOpen}></FontAwesomeIcon>
              </label>
            </div>
          </div>
          :
          <></>
        }
      </div>
    </div>

  )
}

export default Gallery