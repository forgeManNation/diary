import React from 'react'
import {LatLng, Icon} from 'leaflet'
import Geocode from "react-geocode";

interface props {
    mapCentre: LatLng,
    geocodeDataOutput: string,
    changeGeocodeDataOutput: (newGeocodeDataOutput: string) => void
}



const GeocodeData = ({mapCentre, geocodeDataOutput, changeGeocodeDataOutput} : props) => {





// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
// Geocode.setApiKey("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

// Get address from latitude & longitude.
Geocode.fromLatLng("48.8583701", "2.2922926").then(
  (response) => {
    const address = response.results[0].formatted_address;
    changeGeocodeDataOutput(address)
    // console.log(address);
  },
  (error) => {
    console.error(error);
  }
);


  return (
    <div>{geocodeDataOutput}</div>
  )
}

export default GeocodeData