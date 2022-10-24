import React, {useState, useEffect, useCallback, forwardRef, useRef, useImperativeHandle } from 'react'
import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import LocationMarker from "./LocationMarker"
import { LatLng } from 'leaflet'
import { useGeolocated } from "react-geolocated";
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter'

    let theBlob;

const  LeafletMap = forwardRef(({changeCenter, changeZoom, changeMarkerLongitude, changeMarkerLatitude, markerLatitude, markerLongitude, mapCentre, mapZoom, paintedMapChecked, addMap, maps},
   ref) => {


    

    useImperativeHandle(ref, () => ({

      getAlert() {
        alert("getAlert from Child");
      },
       async saveMap(){
        alert("ok so now i will add map")
        takeScreenshot().then(blob => {
          console.log('added BLOB');
          addMap(blob)
        })
        console.log('what do i return?');
        // console.log("waiting for signal", mapScreenshotBlob);
        // if(mapScreenshotBlob){
        if(theBlob){
          addMap(theBlob)
        }
        else{
          console.log('blob failed, log the blob');
        }
          // }
      }

  
    }));
  
  const [gpsLocationErrorMessage, setgpsLocationErrorMessage] = useState("")

  const [map, setMap] = useState(null)
  const initialZoom = 10
  let simpleMapScreenshoter = new SimpleMapScreenshoter()

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



  function takeScreenshot (){
    console.log('do i even happen WATO?');
    let overridedPluginOptions = {
      mimeType: 'image/jpeg',
    }
    simpleMapScreenshoter.addTo(map)
    
    return simpleMapScreenshoter.takeScreen("blob", undefined).then(blob => {
      console.log('that is me, a blob, and here i am overriding it', blob);
      theBlob = blob;
      return blob
      // FileSaver.saveAs(blob, 'screen.png')
    }).catch(e => {
      console.log(e, )

      
    })
  }



  return (
    <>
      <MapContainer ref = {setMap} className='mapContainer' center={mapCentre} zoom = {initialZoom}>
        <TileLayer
        url='https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=3f19809ebd064b10a80b4ea7d2035c35'
        />
        <LocationMarker changeLatitude = {changeMarkerLatitude}
        changeLongitude = {changeMarkerLongitude}
        latitude = {markerLatitude} longitude = {markerLongitude}
        />
        {/* <SimpleMapScreenshoter onMove = {(e) => {e.takeScreen()}}></SimpleMapScreenshoter> */}
      </MapContainer>
      <button onClick={takeScreenshot} >take screenshot</button>
    </>
  );
})

export default LeafletMap