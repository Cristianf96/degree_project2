import React from 'react'

const Maps = () => {

  React.useEffect(() => {
    localStorage.setItem('maps', true)
  })
  
  return (
    <div>Mapa</div>
  )
}

export default Maps