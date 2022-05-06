import React from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

const Maps = () => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY
  })
  const side = localStorage.getItem('maps') ?? ""

  React.useEffect(() => {
    if (!side) {
      localStorage.setItem('maps', true)
      window.location.reload(true);
    }
  }, [side])

  if (!isLoaded) return <div>Loading...</div>
  return (
    <Map />
  )
}

function Map() {

  const center = { lat: 6.24788328286821, lng: -75.560914441354 }
  const Markers = [{ lat: 6.24788328286821, lng: -75.560914441354 }, { lat: 44, lng: -80 }]

  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerStyle={{ width: '100%', height: '92.5vh' }}
    >
      {Markers.map((marker) =>{
        return(
          <Marker position={marker}/>
        )
      })}
    </GoogleMap>)
}

export default Maps