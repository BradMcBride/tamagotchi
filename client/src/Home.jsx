import { useEffect, useState } from 'react'
import * as cookie from "cookie";
import { Link, Outlet } from 'react-router-dom';
import './App.css'
import cat from './assets/Cat2.png'
import tombstone from './assets/tombstone-nb.png'


function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [petName, setPetName] = useState("");
  const [pets, setPets] = useState([]);
  const [minutes, setMinutes] = useState(0);



  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }
  async function getUser() {
    const res = await fetch('/me/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setUser(body.user)
    setLoading(false);
  }

  useEffect(() => {
    getUser();
    getPets();
    const interval = setInterval(() => {
      setMinutes(prevMinutes=> prevMinutes + 1);
      getPets();
  }, 10000)

  return () => clearInterval(interval);
  }, [])

  async function createPet(e){
    e.preventDefault();
    console.log(document.cookie)
    console.log(cookie.parse(document.cookie))
    const res = await fetch ("/pet/", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({
        petName
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })

    const body = await res.json();
    setPets([...pets, body.pet])
  }

  async function getPets(){
    const res = await fetch("/pet/", {
    credentials: "same-origin",
    })

    const body = await res.json();
    setPets(body.pets)
  }

  return (
    <>
    
      {loading && <div>Loading...</div>}
      {user && <h2>Welcome Back, {user.first_name}</h2>}
      <div>
        <form onSubmit={createPet} className="new-pet-form">
            <input type="text" placeholder="Pet Name" value={petName} onChange={e => setPetName(e.target.value)}></input>
            <button>Create Pet</button>
        </form>
        <div>
          {pets.map(pet => (
            <div key={pet.id}>
              <Link to={`/pet/${pet.id}`}>
              <h2>{pet.name} {pet.is_dead ? "(Dead)" : ""}</h2>

              <div className="stat-container">
                {pet.is_dead && <img className="image-container" src={tombstone} alt="Tombstone"/>}
                {!pet.is_dead && <img className="image-container" src={cat} alt="Cat"/>}
                  
                <div className="bar-container">
                  <label> Hunger: <progress max="100" value={pet.hunger}></progress></label>
                  <label> Happiness: <progress max="100" value={pet.happiness}></progress></label>
                  <label> Sleep: <progress max="100" value={pet.sleep}></progress></label>
                </div>
              </div>
              </Link>
            </div>
          ))}
          <Outlet />
        </div>
      </div>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Home;
