import React from "react";
import { useGeolocated } from "react-geolocated";

const Demo = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        <table>
            <tbody>
                <tr>
                    <td>latitude</td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td>longitude</td>
                    <td>{coords.longitude}</td>
                </tr>
                {coords.altitude ? 
                <tr>
                    <td>altitude</td>
                    <td>{coords.altitude}</td>
                </tr>
                : 
                <></>}

                {coords.heading ? 
                <tr>
                    <td>heading</td>
                    <td>{coords.heading}</td>
                </tr>
                :
                <></>}

                {coords.speed ?
                <tr>
                    <td>speed</td>
                    <td>{coords.speed}</td>
                </tr>
                :
                <></>}
            </tbody>
        </table>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Demo;
