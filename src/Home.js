import logo from './logo.svg';
import './Home.css';
import { useEffect,useState } from 'react';
import axios from 'axios';
import Row from './components/Row';

const baseUrl = 'http://localhost:3001'

function Home() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
    .then(response =>{
      setTasks(response.data)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
  }, [])

  const addTask = () => {
    axios.post(baseUrl + '/create',{
      description: task
    })
    .then(response => {
      setTasks([...tasks,{id: response.data.id,description: task}])
      setTask('')
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
  }

  const deleteTask = (id) => {
    axios.delete(baseUrl + '/delete/' + id)
    .then (response => {
      const withoutRemoved = tasks.filter((item) => item.id != id)
      setTasks(withoutRemoved)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
  }

  return (
    <div>
      <h3>todo</h3>
      <form>
        <input 
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e =>{
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <ul>
          {tasks.map(item => (
            <Row key={item.id} item={item} deleteTask={deleteTask}/>
          ))
          }
      </ul>
    </div>

  );
}

export default Home;