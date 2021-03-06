import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';



function App() {
    const CLIENT_ID = "347edc5f4c364696ad4b0acfba33f197"
    const REDIRECT_URI = "https://ginkoding.github.io/spotify-project/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])



    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")



if (!token && hash) {
    token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

    window.location.hash = ""
    window.localStorage.setItem("token", token)
    }

        setToken(token)

    }, [])

    const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    }

const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
        authorization: `Bearer ${token}`
    },
    params: {
        q: searchKey,
                type: "artist"
            }
        })

    setArtists(data.artists.items)
    }

    const renderArtists = () => {
    return artists.map(artist => (
    <div id="contain">
        <div key={artist.id} id="images">
        {artist.images.length ? <a href={artist.external_urls.spotify} target="_blank"> <img width={"100%"} src={artist.images[0].url} alt=""/></a> : <div>No Image</div>}
        {artist.name}
        {artist.followers.total ? <p>Total followers: {artist.followers.total}</p> : <p>No Followers</p>}
        </div>
        </div>
        ))
    }





    return (
    <div className="App">
    <header className="App-header">
    <h1>Spotify React Project</h1>

            {token ?
            <form onSubmit={searchArtists}>
            <input type="text" placeholder="Artist Name" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
            </form>
            : <h2></h2>
        }

{!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
            to Spotify</a>
        : <button onClick={logout}>Logout</button>}

        {renderArtists()}
            

        </header>
        </div>
    );
}

export default App;
