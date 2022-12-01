import React, { useState, useEffect } from 'react';
import api from './services/api'
import './app.css'
import './global.css'
import './sidebar.css'
import './main.css'
import Notes from './componentes/notes'
import RadioButton from './componentes/radioButton';

function App() {
  const [ selectedValue, setSelectedValue] = useState('all');
  const [ title, setTitles] = useState('');
  const [ notes, setNotes] = useState('');
  const [ allNotes, setAllNotes] = useState([]);

  useEffect(() =>
  {    
    getAllNotes();
  },[]);
  
  async function getAllNotes()
  {
    const response = await api.get('/annotations', );
    setAllNotes(response.data);
  }

  async function loadNotes(option)
  {
    const params = { priority: option };
    const response = await api.get('/priorities',{ params });

    if(response)
    {
      setAllNotes(response.data);
    }
  }

  function filtraPriority(filtro)
  {
    if(filtro && filtro !== 'all')
      loadNotes(filtro);
    else
      getAllNotes();
  }

  function handleChange(e)
  {
    setSelectedValue(e.value);
    filtraPriority(e.value);
  }

  async function handleDelete(id)
  {
    const deletedNote = await api.delete(`/annotations/${ id }`);

    if(deletedNote)
    {
      setAllNotes(allNotes.filter(note => note._id !== id));
    }
  }

  async function handlePriority(id)
  {
    const changedPriorityNote = await api.put(`/Priorities/${ id }`);

    filtraPriority(selectedValue);
  }

  async function handleSubmit(e)
  {
    e.preventDefault();

    const response = await api.post('/annotations',{
      title,
      notes,
      priority: false
    });

    setTitles('');
    setNotes('');

    if(selectedValue !== 'all')
    {
      getAllNotes();
      setSelectedValue('all');
    }
    else      
      setAllNotes([...allNotes, response.data]);
  }

  useEffect(()=>{
    function enableSubmitButton()
    {
      let btn = document.getElementById('btn_submit');
      btn.style.background = '#ffd3ca';

      if(title && notes)
      {
        btn.style.background = '#eb8f7a';
      }
    }

    enableSubmitButton();

  },[title, notes]);
    
  return (
    <div id='app'> 
      <aside>
        <strong>Caderno de notas</strong>  
        <form onSubmit={handleSubmit}>
          <div className='input-block'>
            <label htmlFor='title'>Titulo da anotação</label>
            <input 
              value={ title } 
              required 
              onChange={e => setTitles(e.target.value)}
              maxLength='30'
              />
          </div>

          <div className='input-block'>
            <label htmlFor='nota'>Anotações</label>
            <textarea 
              value={ notes } 
              required 
              onChange={e => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button id='btn_submit' type='submit'>Salvar</button>          
        </form>

        <RadioButton 
          selectedValue={ selectedValue }
          handleChange={ handleChange }
        />

      </aside>
      
      <main>
        <ul>
          {allNotes.map(data => (
            <Notes 
              data={data}
              handleDelete={handleDelete}
              handlePriority={handlePriority}
              />
            ))}          
        </ul>
      </main>
    </div>
  );
}

export default App;
