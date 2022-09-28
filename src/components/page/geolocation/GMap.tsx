import {useMemo} from "react"
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"


const GMap = () => {

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: 'AIzaSyBlDhSVuMx6nJMsIyN_nqvsK1FJwmu1svk'
  }) 

  if(!isLoaded){
    return <h1>still loading</h1>
  }


  return (
    <Map></Map>
  )
}

const Map : React.FC = () =>{
  return <GoogleMap zoom={10} center = {{lat: 44, lng: -80}} mapContainerStyle = {{height: "10vh", width: "100%"}} />
} 

export default GMap