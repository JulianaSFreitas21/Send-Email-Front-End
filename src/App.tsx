import { useEffect, useState } from "react"
import { states } from "./data/states"
import sucess from "./assets/sucess.svg"
import axios  from "axios"
import { api } from "./lib/server";

function App() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cel, setCell] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [indication, setIndication] = useState('');
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [terms, setTerms] = useState(false);

  useEffect(()=> {
    const validateCityFunction = async () => {
      if (city !== '' ) {
        await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`, {method: "GET"})
          .then(res => {
            let response = res.data;
            let citys = response.map((r: any) => {
                return r.nome
            });
              
            let cityValidate = citys.includes(city);
              
            if (!cityValidate) {
              setError('Digite uma cidade válida');
              return;
            }else{
              setError('');
            }
          })
      }
    }

    validateCityFunction();
  })

 async function handleDatas(e:any){
  e.preventDefault();
    
  await api.post('/', {
      name,
      lastName,
      state,
      city,
      email,
      indication,
      cel,
      cep
    },{
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => {
      if (res.status === 200) {
        setSucesso(true);
        setTimeout(() => tabClose(), 3000);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }

  function tabClose() {
    var tab = window.open("","_top");
    if (tab === null) return;
    
    tab.close();
    window.close();
  }
  
  return (
    <>
      {sucesso? (
        <>
        <div className="container">
          <h3>Sucesso</h3>
          <img src={sucess} alt="Sucesso" />
        </div>
        </>
      ):(
        <>
          <form onSubmit={handleDatas}>
            <h3>Insira os dados abaixo</h3>
            <input type="hidden" name="_captcha" value="false"/>
            <input type="hidden" name="_blacklist" value="spammy pattern, banned term, phrase"></input>
            <input id='name' value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Nome" required/>
            <input id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Sobrenome" required/>
            <select name="state" id="state" value={state} onChange={(e) => setState(e.target.value)} required>
              <option value={0}>Estado</option>
              {
                states.map((value, index) => {
                  return <option key={index} value={value.sigla}>{value.name}</option> 
                })
              }
            </select>
            <input id='city' value={city} type="text" onChange={(e) => setCity(e.target.value)} placeholder="Cidade" required/>
            <input id='email' value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            <input id='cel' value={cel} type="tel" onChange={(e) => setCell(e.target.value)} placeholder="Celular"/>
            <input id='text' value={cep} type="tel" onChange={(e) => setCep(e.target.value)} placeholder="CEP"/>
            <input id='indication' value={indication} type="text" onChange={(e) => setIndication(e.target.value)} placeholder="Indicação" required/>
            <div className="terms">
              <input id='terms' type="checkbox" onChange={() => setTerms(!terms)} required/>
              <label htmlFor="terms">Termos de Compromisso</label>              
            </div>
            {error && <span id="error">{error}</span>}
            <input value={'Enviar'} id='submit' type="submit"></input>
          </form>
        </>
      )}
    </>
  )
}

export default App
