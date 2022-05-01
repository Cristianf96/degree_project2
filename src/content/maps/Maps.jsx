import React from 'react'

const Maps = () => {

  const side = localStorage.getItem('maps') ?? ""

  React.useEffect(() => {
    if(!side){
      localStorage.setItem('maps', true)
      window.location.reload(true);
    }
  }, [side])

  return (
    <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab nulla omnis maxime, doloremque molestiae iusto voluptate. Neque, assumenda architecto earum adipisci quia voluptatem consequuntur a modi, nisi deleniti non ipsam?</div>
  )
}

export default Maps