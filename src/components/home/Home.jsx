import React from 'react'

// import { homeStyles } from "./homeStyle";

const Home = () => {

    const side = localStorage.getItem('maps') ?? ""
    
    React.useEffect(() => {
        if(side){
            localStorage.removeItem('maps')
            window.location.reload(true);
        }
    },[side])

    return (
        <>
            <div>Home</div>
        </>
    )
}

export default Home