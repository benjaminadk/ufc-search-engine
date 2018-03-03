import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { compose, withProps } from 'recompose'

export const Map = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
    )((props) => (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={props.center}
        >
            {props.isMarkerShown && <Marker position={props.center} />}
        </GoogleMap>
    ))