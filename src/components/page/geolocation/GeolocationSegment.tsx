import React from 'react'
import Demoo from "./Demoo"
import "./geolocationSegment.scss";
import GMap from "./GMap"
const GeolocationSegment = () => {
  return (
    <div id='geolocationSegment'>
    {/* <Demoo></Demoo> */}
    <div className="gmapcontainer" style={{width: "25vh", height: "25vh"}}>
    <GMap></GMap>
    </div>
    <div>GeolocationSegment</div>
    </div>
  )
}

export default GeolocationSegment