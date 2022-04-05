import API from "@aws-amplify/api";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { createPet,deletePet  } from "./graphql/mutations";
import { listPets } from "./graphql/queries";

function App() {
  const [petData, setPetData] = useState([]);
  useEffect(() => {
    const fetchedPets = async () => {
      const res = await API.graphql({ query: listPets });
      //console.log(res.data.listPets.items)
      return res.data.listPets.items;
     
    };
    
    fetchedPets().then(pets => setPetData(pets));
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { target } = e;
    try {
      const {data} = await API.graphql({
        query: createPet,
        variables: {
          input: {
            name: target.petName.value,
            description: target.petDescription.value,
            petType: target.petType.value,
          },
        },
      });
      setPetData((currPetList)=>{
      return [...currPetList, data.createPet]
      })
    } catch (error) {
      console.log(error);
    }
  };

    const handlePetDelete = async(petID)=>{
      const newPetList = petData.filter((pet)=>pet.id !== petID)
      try{
        await API.graphql({
          query:deletePet,
          variables:{
            input:{
              id:petID
            }
          }
        })
        setPetData(newPetList)
      }catch(error){
        console.log(error)
      }
       
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter a name" name="petName" />
        <input placeholder="Enter a Description" name="petDescription" />
        <select name="petType">
          <option>Please select a pet</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="turtle">Turtle</option>
        </select>
        <button type="submit">Create Pet</button>
      </form>
      <main>
      <ul>
        {petData.map(pet => (
          
            <li 
            onClick={(e)=>handlePetDelete(pet.id)}
            key={pet.id}
             style={{  
              listStyle:'none',
              border:'1px solid black',
              margin:'10px',
              width:'200px'


          }}
            >
              <article>
                <h3>{pet.name}</h3>
                <h5>{pet.petType}</h5>
                 <p>{pet.description}</p>
              </article>
            </li>
         
        ))}
         </ul>
      </main>
    </div>
  );
}

export default withAuthenticator(App);
