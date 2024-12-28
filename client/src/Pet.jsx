import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import * as cookie from "cookie";
import cat from './assets/catGif.gif'
import grave from './assets/grave.webp'

export function Pet(){
    const params = useParams();
    const [petName, setPetName] = useState("")
    const [petHunger, setPetHunger] = useState("")
    const [petHappy, setPetHappy] = useState("")
    const [petSleep, setPetSleep] = useState("")
    const [petLight, setPetLight] = useState(false)
    const [petDead, setPetIsDead] = useState(false)
    const [minutes, setMinutes] = useState(0);
    const petLightRef = useRef(petLight);
    const [showConfirmation, setShowConfirmation] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        petLightRef.current = petLight;
    }, [petLight])
    

    async function getPetInfo(){
        const res = await fetch(`/pet_info/${params.id}`, {
        credentials: "same-origin",
        })

        const body = await res.json();
        setPetName(body["name"])
        setPetHunger(body["hunger"])
        setPetHappy(body["happiness"])
        setPetSleep(body["sleep"])
        setPetLight(body["light_on"])
        setPetIsDead(body["is_dead"])

        

      }
    useEffect(() => {
        getPetInfo();
        const interval = setInterval(() => {
            setMinutes(prevMinutes=> prevMinutes + 1);
            getPetInfo();
            increaseHappy();
        }, 1000)
  
        return () => clearInterval(interval);
    }, [])


    async function feedPet(){
        const res = await fetch (`/feed_pet/${params.id}`, {
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
    }

    async function increaseHappy(){
        if (petLightRef.current) {
            const res = await fetch (`/increase_happy/${params.id}`, {
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
        }
    }

    async function toggleLight(){
        const newLightState = !petLight
        if (newLightState == false){
            const res = await fetch (`/toggle_light_off/${params.id}`, {
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
        } else {
            const res = await fetch (`/toggle_light_on/${params.id}`, {
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
        }
        setPetLight(newLightState)
    }

    async function handleConfirm (){
        const res = await fetch (`/delete_pet/${params.id}`, {
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
        navigate(-1);
        setShowConfirmation(false)
    }
    async function handleCancel(){
        setShowConfirmation(false);
    }
    
        
    return(
        <div>        
            <h1>{petName} {petDead ? "(Dead)" : ""}</h1>
            <div>
                <button onClick={() => navigate(-1)}>Back</button>
                <button onClick={feedPet}>Feed Pet</button>
                <button onClick={toggleLight}>Toggle Light</button>
            </div>
            {petDead && <img className="pet-image" src={grave} alt="Grave"/>}
            {!petDead && <img className="pet-image" value={petLight} src={cat} alt="Cat"/>}

            <div className="bar-container-pet">
                <label> Hunger: <progress max="100" value={petHunger}></progress></label>
                <label> Happiness: <progress max="100" value={petHappy}></progress></label>
                <label> Sleep: <progress max="100" value={petSleep}></progress></label>
            </div>
            <div>
                <button value="delete" onClick={() => setShowConfirmation(true)}>
                Delete </button>
                {showConfirmation && (
                    <div>
                        <p>Are you sure you want to remove your pet?</p>
                        <button value="delete" onClick={handleConfirm}>Yes</button>
                        <button onClick={handleCancel}>No</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Pet
