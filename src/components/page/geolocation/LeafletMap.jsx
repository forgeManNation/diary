import React, {useState, useEffect, useCallback} from 'react'
import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import LocationMarker from "./LocationMarker"
import { LatLng } from 'leaflet'
import { useGeolocated } from "react-geolocated";



function LeafletMap({changeCenter, changeZoom, changeMarkerLongitude, changeMarkerLatitude, markerLatitude, markerLongitude, mapCentre, mapZoom, paintedMapChecked}) {
    
  
    const [gpsLocationErrorMessage, setgpsLocationErrorMessage] = useState("")

    const [map, setMap] = useState(null)
    const initialZoom = 10

  
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

  React.useEffect(() => {
        
    if(isGeolocationEnabled){
      if (isGeolocationAvailable){
         if (coords !== undefined){ 
           changeMarkerLongitude(coords.longitude)
           changeMarkerLatitude(coords.latitude)
           setgpsLocationErrorMessage("")
           setMap(map.setView(new LatLng(coords.latitude, coords.longitude), 1))
           setMap(map.setZoom(5))
           changeCenter(new LatLng(coords.latitude, coords.longitude))
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
  
  


   

    const onMove = useCallback(() => {
      if(map !== null){
      changeCenter(map.getCenter())
      
      }
    }, [map])

  
    useEffect(() => {
      if(map !== null){
        map.on('move', onMove)
        return () => {
          map.off('move', onMove)
        }
      }
    }, [map, onMove])


    return (
      <MapContainer ref = {setMap} className='mapContainer' center={mapCentre} zoom = {initialZoom}>
        <TileLayer
        url='https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=3f19809ebd064b10a80b4ea7d2035c35'
        />
        <LocationMarker changeLatitude = {changeMarkerLatitude}
        changeLongitude = {changeMarkerLongitude}
        latitude = {markerLatitude} longitude = {markerLongitude}
        />
      </MapContainer>
    );
  }

export default LeafletMap