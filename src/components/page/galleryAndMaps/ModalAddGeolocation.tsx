import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import React, {useState, useEffect, useCallback, useRef} from "react"
import {LatLng} from 'leaflet'
import 'leaflet/dist/leaflet.css';
import './modalAddGeolocation.scss'
import LocationMarker from "./LocationMarker"
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter'
import { useGeolocated } from "react-geolocated";
import LeafletMap from "./LeafletMap.jsx"


interface props {
    triggerModalAddGeolocationOpen: () => void,
    modalAddGeolocationOpen: boolean
    addMap: (newMapScreenshot: Blob) => void,
}


function ModalAddGeolocation({triggerModalAddGeolocationOpen, modalAddGeolocationOpen, addMap}: props) {
  const [markerLatitude, setmarkerLatitude] = useState(51.505)
  const [markerLongitude, setmarkerLongitude] = useState(-0.09)
  const [mapZoom, setmapZoom] = useState(1)
  const [gpsLocationErrorMessage, setgpsLocationErrorMessage] = useState("")
  const [mapCentre, setmapCentre] = useState(new LatLng(51.505, -0.09))
  const [paintedMapChecked, setpaintedMapChecked] = useState(true)
  const [checkmarkAddLocationDescription, setcheckmarkAddLocationDescription] = useState(true)
  


  interface RefObject {
    saveMap: () => void
  }
  
  const leafletMapRef = useRef<RefObject>(null)


    function triggerCreateMap () {

      if(leafletMapRef.current){
        leafletMapRef.current.saveMap()
        
      }
      //createMap(mapZoom, mapCentre, new LatLng(markerLatitude, markerLongitude))
    }

    function changeLatitude (e :  React.ChangeEvent<HTMLInputElement>) {
        setmarkerLatitude(Number(e.target.value))
    }
     
    function changeLongitude (e: React.ChangeEvent<HTMLInputElement>) {
        setmarkerLongitude(Number(e.target.value))
    }

    function changeCenter (newCenter: LatLng){
      setmapCentre(newCenter)
    }

    function changeZoom(newZoom :number){
    }

    function changeMarkerLatitude(newLatitude : number){
      setmarkerLatitude(newLatitude)
    }

    function changeMarkerLongitude(newLongitude : number){
        setmarkerLongitude(newLongitude)
    }



    const leafletMapProps = {
      paintedMapChecked,
       markerLatitude,
       markerLongitude,
       mapCentre,
       changeCenter,
       mapZoom,
       changeZoom,
       changeMarkerLatitude,
       changeMarkerLongitude,
       addMap,
       triggerModalAddGeolocationOpen
    }
    

    

  return (
    <Modal className='geolocationModal' show={modalAddGeolocationOpen} onHide={triggerModalAddGeolocationOpen}>
    <Modal.Header closeButton>
      <Modal.Title>Enter your location</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form.Group controlId="formBasicEmail">
          <div className="d-flex flex-row justify-content-center align-items-center">
            <Form.Label>Lattitude</Form.Label>
            &nbsp;
            &nbsp;
            <Form.Control type="number" value={markerLatitude}  onChange = {changeLatitude} placeholder="Lattitude" />
            &nbsp;
            &nbsp;
            <Form.Label>Longitude</Form.Label>
            &nbsp;
            &nbsp;
            <Form.Control type="number" value={markerLongitude} onChange = {changeLongitude} placeholder="Longitude" />
          </div>
            <LeafletMap ref = {leafletMapRef} {...leafletMapProps}></LeafletMap>
            <code className = "gpsLocationErrorMessage">{gpsLocationErrorMessage}</code>
            <div className='checkMarkMapLayerSection'>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" onClick={() => {setcheckmarkAddLocationDescription(!checkmarkAddLocationDescription)}} checked = {checkmarkAddLocationDescription} id="flexCheckDefault"/>
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Add location description
              </label>
            </div>
            
            </div>  
            
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={triggerModalAddGeolocationOpen}>
        Close
      </Button>
      <Button variant="success" onClick={() => {triggerCreateMap()}}>
        {/* ; triggerModalAddGeolocationOpen() */}
        Add to page
      </Button>
    </Modal.Footer>
  </Modal>
  );
}

export default ModalAddGeolocation