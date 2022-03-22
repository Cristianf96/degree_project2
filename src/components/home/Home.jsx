import React from 'react'

// import { homeStyles } from "./homeStyle";

const Home = () => {

    React.useEffect(() => {
        localStorage.removeItem('maps')
    })

    return (
        <>
            <div>Home</div>
        </>
    )
}

export default Home