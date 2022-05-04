import React from 'react'
import { collection, getDocs } from "firebase/firestore";
import db from '../../utils/firebase';

// import { homeStyles } from "./homeStyle";

const Home = () => {

    const side = localStorage.getItem('maps') ?? ""

    React.useEffect(() => {
        if (side) {
            localStorage.removeItem('maps')
            window.location.reload(true);
        }
        const textDb = async() =>{
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().age}, ${doc.data().name}`);
            });
        }
        textDb()
    }, [side])

    return (
        <>
            <div>Home</div>
        </>
    )
}

export default Home