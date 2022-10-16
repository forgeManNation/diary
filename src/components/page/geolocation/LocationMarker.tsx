import React from 'react'
import { useMapEvents, Marker } from 'react-leaflet';
import {LatLng, Icon} from 'leaflet'

interface props {
    longitude: number,
    latitude: number,
    changeLatitude: (newLatitude: number) => void,
    changeLongitude: (newLongitude: number) => void
}

const LocationMarker = ({latitude, longitude, changeLatitude, changeLongitude}: props) => {
  
  console.log(longitude, latitude, "LAT AND LONG :)");
  


    const icon: Icon = new Icon({
        iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACtElEQVRogeWazYuNURzHPzNoyCWJxmSKRAnlWelaWthosLOh/ANWLCw1kyZbbrqGBVsbJVlIibxLpCzIQiQ1eRu5V/cyXhbnPN1x5758z3PPOU/41K+m7u/5nu93nuc559znufCP0OdZbxEwAmwDEmA1sMR+NgW8BJ4A14DLwBfP4/fMEFAGqsAvsarAGWBtDn5nMQCMARX0AM31DThmtXJhGXCjg0HXugOsiJoA2AS87tF4q3pltaMwGCjEzDCDoUPMx1wCoUKkdZvA98xYhBBpjYcKMURvs5Nr1YE1IYKUI4ZIa8J3iAJmFY4dpGLH7kq/GGSnKmipAyeAoj2uYP8u2c9UFgI7HPq7chr9v/gG2NxBK7E9qt4pn0EeiIPWuoRISWyvonnPYw7eiYMed9AsiZqTXhJY6uKgWxw0i6JmzUsCi3oZuEwIBVHzqyKmzlpTDgZVvI6tin0S+zaIfS69H5UmNcgLsW+f2AewV+x77qDZlXH0GzMR9BL0CWTUYw72iIOmC2KnMK4L4i6fQZYDPxwGr2PWiZlblK00tiiqzndgsc8gAI8dDPiqm6o59WYHuOTQ64uLIUTXE/ds/ARWhQgC8ChikOsuxlwuLTBPBmNRDilewGwZQp+Nt8A8F2OuZ6QCnHU8JgsnMVNvUIbRd8NZ6jONJ/gyrmcEzKp8LsNxKiXC7LZbspIwz7g+AEtjhUgZ9WC8uQ5ETWBZgN+H2c9wnKl8sl8wqNZIZO9/0A88bGHKta7GNt6KBPP6LGuIKrAuuus2qN8gW9XBHPy2ZQB4inuI+8CcHPx2pAhMo4eoARtzcSpwFD3IoZw8SswFbtE9xBWybY+iMgy8p32IScxrvL+C3Zivqs0hpoHtOfrKxBFmBzmcq6OM9AHnaYS4gP9fI0WjgHnjdBe3Vw7/L78ByP0EVSkVHdcAAAAASUVORK5CYII=",
        className: 'customMarker' 
      });
      

    const map = useMapEvents({
      click(e) {
        changeLatitude(e.latlng.lat)
        changeLongitude(e.latlng.lng)        
      }
    });
    const marker: LatLng = new LatLng(latitude, longitude);
    return <Marker  icon={icon}  position={new LatLng(latitude, longitude)} ></Marker>
  }

export default LocationMarker