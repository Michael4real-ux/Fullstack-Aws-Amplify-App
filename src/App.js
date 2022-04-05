import API from '@aws-amplify/api';
import {withAuthenticator} from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react';
import {createPet} from './graphql/mutations'
import {listPets} from './graphql/queries'

function App() {
  const [petData, setPetData] =useState([])
  useEffect(()=>{
    const fetchedPets = async()=>{
     const res = await API.graphql({query:listPets})
       return res.data.listPets.items
    }
    fetchedPets().then(pets=>setPetData(pets))
  })
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const  {target} = e
   try{
    await API.graphql({
      query:createPet,
      variables:{
       input:{
         name: target.petName.value,
         description: target.petDescription.value,
         petType: target.petType.value,
       }
      }
    })
   }catch(error){
     console.log(error)
   }
  }

  return (
   <div>
     <form onSubmit={handleSubmit}>
       <input placeholder='Enter a name'
        name='petName'
       />
       <input placeholder='Enter a Description'
        name='petDescription'/>
       <select name='petType'>
         <option>Please select a pet</option>
         <option value='dog'>Dog</option>
         <option value='cat'>Cat</option>
         <option value='rabbit'>Rabbit</option>
         <option value='turtle'>Turtle</option>
       </select>
       <button type='submit'>Create Pet</button>
     </form>
     
   </div>
  );
}

export default withAuthenticator(App);
