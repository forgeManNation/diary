import React, {useState} from 'react'
import ModalAddGeolocation from "./ModalAddGeolocation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMap} from '@fortawesome/free-solid-svg-icons'
import { LatLng } from 'leaflet'

const Map = () => {
        const [maps, setmaps] = useState<Blob[]>([])

        function triggerModalAddGeolocationOpen (){
                setmodalAddGeolocationOpen(!modalAddGeolocationOpen)
        }
        
        function addMap(newMapScreenshot : Blob){
                setmaps([...maps, newMapScreenshot]);
                console.log("OMG I AM SETTING MAP WITH", newMapScreenshot);
        }
        const [modalAddGeolocationOpen, setmodalAddGeolocationOpen] = useState(false)


        console.log(maps, 'log me the maps pls');
        
  return (
        <>
        {
                maps.map(map => {
                        return String(map) + "waaaau"
                })
        }
        <div>
        <button onClick = {triggerModalAddGeolocationOpen} className=" btn addAdditionalFeatureButton"> 
                <FontAwesomeIcon  icon={faMap}  />
                &nbsp;
                Add map
        </button>
        </div>
        {/* get Zoom, mapLatLng, markerLatLng  */}
        <ModalAddGeolocation maps = {maps} addMap = {addMap}  triggerModalAddGeolocationOpen = {triggerModalAddGeolocationOpen} modalAddGeolocationOpen = {modalAddGeolocationOpen}></ModalAddGeolocation>
        </>
  )
}

export default Map