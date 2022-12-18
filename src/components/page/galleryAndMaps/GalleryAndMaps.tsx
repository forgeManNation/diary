import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faImage, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import "./gallery.scss"
import ModalAddGeolocation from "./ModalAddGeolocation"
import { LatLng } from 'leaflet'
import { Tooltip } from 'reactstrap'

interface galleryProps {
  images: Blob[],
  changeImages: (newImages: Blob[]) => void,
  editMode: boolean;
}

const Gallery = (props: galleryProps) => {

  const [modalAddGeolocationOpen, setmodalAddGeolocationOpen] = useState(false)

  const [geolocationTooltipOpen, setgeolocationTooltipOpen] = useState(false)
  const [imageTooltipOpen, setimageTooltipOpen] = useState(false)
  const geolocationIconRef = useRef(null)
  const imageIconRef = useRef(null)

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
              <FontAwesomeIcon ref={geolocationIconRef} className='addAdditionalFeatureButton' icon={faMapLocation} onClick={triggerModalAddGeolocationOpen}></FontAwesomeIcon>
              <Tooltip
                placement='bottom'
                isOpen={geolocationTooltipOpen}
                target={geolocationIconRef}
                toggle={() => setgeolocationTooltipOpen(!geolocationTooltipOpen)}
              >
                Add your location
              </Tooltip>
              {/* get Zoom, mapLatLng, markerLatLng  */}
              <ModalAddGeolocation addMap={(newMapBlob) => { props.changeImages([...images, newMapBlob]) }} triggerModalAddGeolocationOpen={triggerModalAddGeolocationOpen} modalAddGeolocationOpen={modalAddGeolocationOpen}></ModalAddGeolocation>


              &nbsp;
              &nbsp;
              &nbsp;

              <label htmlFor="upload">
                <FontAwesomeIcon ref={imageIconRef} icon={faImage} className="addAdditionalFeatureButton"></FontAwesomeIcon>
              </label>

              <Tooltip
                placement='bottom'
                isOpen={imageTooltipOpen}
                target={imageIconRef}
                toggle={() => setimageTooltipOpen(!imageTooltipOpen)}
              >
                Add an image
              </Tooltip>
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