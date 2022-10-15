import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import {MapContainer, TileLayer} from 'react-leaflet'
import React, {useState} from "react"
import {LatLng} from 'leaflet'
import 'leaflet/dist/leaflet.css';
import './modalAddGeolocation.scss'
import { useGeolocated } from "react-geolocated";
import LocationMarker from "./LocationMarker"

interface props {
    triggerModalAddGeolocationOpen: () => void,
    modalAddGeolocationOpen: boolean
}

function ModalAddGeolocation({triggerModalAddGeolocationOpen, modalAddGeolocationOpen }: props) {
  const [latitude, setlatitude] = useState(51.505)
  const [longitude, setlongitude] = useState(-0.09)
  const [mapZoom, setmapZoom] = useState(1)
  const [gpsLocationErrorMessage, setgpsLocationErrorMessage] = useState("")
  const [mapCentre, setmapCentre] = useState(new LatLng(51.505, -0.09))
  const [paintedMapChecked, setpaintedMapChecked] = useState(true)

  
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

      
  React.useEffect(() => {
    
  }, [mapZoom])
  



    


      React.useEffect(() => {
        
        if(isGeolocationEnabled){
          if (isGeolocationAvailable){
             if (coords !== undefined){ 
               setlongitude(coords.longitude)
               setlatitude(coords.latitude)
               setgpsLocationErrorMessage("")
               setmapCentre(new LatLng(coords.latitude, coords.longitude))
              //  setmapZoom(10)
             }
             
           }
          else{
            setgpsLocationErrorMessage("device geolocation is not avaliable ")
          }
       }
       else{
         setgpsLocationErrorMessage("device GPS is not enabled - enable it in your browser")
       }
      }, [coords])
      

        
  



      
      function LeafletMap() {
      
        const initialZoom = 10

        const satelliteMapLayer = <TileLayer
        url= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        
        const railwayThemeMapLayer = <TileLayer
        url='https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=3f19809ebd064b10a80b4ea7d2035c35'
        />

        return (
          <MapContainer className='mapContainer' center={mapCentre} zoom = {initialZoom}>
           {paintedMapChecked ? railwayThemeMapLayer : satelliteMapLayer}

            <LocationMarker changeLatitude = {(newLatitude) => {setlatitude(newLatitude)}}
            changeLongitude = {(newLongitude) => {setlongitude(newLongitude)}}
            latitude = {latitude} longitude = {longitude}
            />
          </MapContainer>
        );
      }

    function triggerSaveMap (e: any) {      

    }

    function changeLatitude (e :  React.ChangeEvent<HTMLInputElement>) {
        setlatitude(Number(e.target.value))
      }
     

    function changeLongitude (e: React.ChangeEvent<HTMLInputElement>) {
        setlongitude(Number(e.target.value))
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
            <Form.Control type="number" value={Math.round(latitude * 100) / 100}  onChange = {changeLatitude} placeholder="Lattitude" />
            &nbsp;
            &nbsp;
            <Form.Label>Longitude</Form.Label>
            &nbsp;
            &nbsp;
            <Form.Control type="number" value={Math.round(longitude * 100) / 100} onChange = {changeLongitude} placeholder="Longitude" />
          </div>
            <LeafletMap></LeafletMap>
            <code className = "gpsLocationErrorMessage">{gpsLocationErrorMessage}</code>
            <div className='radioButtonsMapLayerSection'>

            <div className="form-check">
              <input className="form-check-input" onClick={() => {setpaintedMapChecked(true)}} type="radio" name="paintedMapRadios" id="paintedMapRadios1" value="option1" checked = {paintedMapChecked}/>
              <label className="form-check-label" htmlFor="paintedMapRadios1">
                Painted Map
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" onClick={() => {setpaintedMapChecked(false)}} type="radio" name="paintedMapRadios" id="paintedMapRadios2" value="option2" checked = {!paintedMapChecked}/>
              <label className="form-check-label" htmlFor ="paintedMapRadios2">
                Satellite Map 
              </label>
            </div>
            </div>



              
            
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={triggerModalAddGeolocationOpen}>
        Close
      </Button>
      <Button variant="success" onClick={triggerSaveMap}>
        Add to page
      </Button>
    </Modal.Footer>
  </Modal>
  );
}

export default ModalAddGeolocation