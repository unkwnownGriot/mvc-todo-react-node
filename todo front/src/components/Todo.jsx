import React,{useState, useEffect,useRef} from 'react';
import axios from 'axios'
const Todo = () => {

const [todos,setTodos] = useState([])
const [playOnce,setPlayOnce] = useState(true)
const [loading,setLoading] = useState(true)
const [newTodo,setNewTodo] = useState('')
const [filter,setFilter] = useState('all')
const [update,setUpdate] =useState('')


useEffect(()=>{
    if(playOnce){
 axios.get('http://localhost:8080/todo/').
  then(res=> setTodos(res.data))
}
  setPlayOnce(false)
  setLoading(false)
  console.log(loading)
  filteredToDos()
},[filter])



var remain = todos.filter(todo => {return !todo.completed})
var done = todos.filter(todo => {return todo.completed})



function task_submit(e){
    e.preventDefault()
    add_task(newTodo)
    setNewTodo("")
}

function add_task(user_task){
    
    if(user_task.trim().length && user_task){
        axios.post('http://localhost:8080/todo/', {
            task:user_task,
          })
          .then(function (response) {
            console.log(response);
            axios.get('http://localhost:8080/todo/').
           then(res=> setTodos(res.data))
           
          })
          .catch(function (error) {
            console.log(error);
          });
        }
     
}

function removeItems(id_todo){
     axios.delete(`http://localhost:8080/todo/${id_todo}`).then((response)=>{
         axios.get('http://localhost:8080/todo/').
         then(res=> setTodos(res.data))
     }).catch(err=>console.log(err))
     

  
}

function completeAll(e){
    var check = e.target.checked
    console.log(check)
    axios.patch('http://localhost:8080/todo/',{
        completed:check
    }).then((response)=>{
        console.log(response.data)
        axios.get('http://localhost:8080/todo/').
       then(res=> setTodos(res.data))
       
    }).catch(err=>console.log(err))
    

}

// fonction pour faire toggler les checkbox et afficher les tâches comme éffectuées

function toggleTodo(id_todo,e){
    
    axios.patch(`http://localhost:8080/todo/${id_todo}`,{
        completed:e.target.checked
    }).then((response)=>{
        console.log(response.data)
        axios.get('http://localhost:8080/todo/').
       then(res=> setTodos(res.data))
       
    }).catch(err=>console.log(err))


}


function toggleEditing(id_todo){
    var editingTab = todos.map(todo=>{
        return todo._id === id_todo ?{...todo,editing:!todo.editing}:{...todo}
    })
    setTodos(editingTab)
}

// function pour filtrer les todos

function filteredToDos(){
    if(filter === 'todo'){
        return todos.filter(todo=>!todo.completed)
    }else if(filter==='done'){
        return todos.filter(todo=>todo.completed)
    }
    return todos
}

// function pour mettre à jour les todos

function handleUpdate(todo_id,e){
    axios.patch(`http://localhost:8080/todo/${todo_id}`,{
        task:update
    }).then((response)=>{
        console.log(response.data)
        axios.get('http://localhost:8080/todo/').
         then(res=> setTodos(res.data))
         
    }).catch(err=>console.log(err))

console.log(loading)
}




// fonction pour supprimer les tâches restantes

function deleteCompleted(){
    var deleted = todos.filter(item=>{
        return item.completed === true
    })
    var deleted_id = deleted.map(el=>{
        return el._id
    })
    axios.delete('http://localhost:8080/todo/',{data:{id:deleted_id}}).then((response)=>{
        console.log(response.data)
        axios.get('http://localhost:8080/todo/').
         then(res=> setTodos(res.data))
         
    }).catch(err=>console.log(err))
    
}


if(loading){
    return '...Loading'
}





    return (
        <div>
        <section className="todoapp">
            <form onSubmit={task_submit}>
               <header className="header">
                    <h1>Todos</h1>
                    <input type="text" className='new-todo'
                     placeholder='ajoutez une nouvelle tâche' 
                     value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}
                      />
                </header>
             </form>  
                <div className="main">
                     <input type="checkbox"  id="toggle-all"
                    onChange={completeAll}
                    className='toggle-all' />
                  { todos.length > 0 && <label htmlFor="toggle-all" ></label>}
                    <ul className='todo-list'>
                    {   
                    filteredToDos().map(todo=> <li key={todo._id} 
                        className={(todo.completed?'completed ':'')+''+(todo.editing?'editing':'')} >
                            <div className="view" >
                                <input type="checkbox"
                                className="toggle"
                                checked={todo.completed}
                               onClick={(e)=>toggleTodo(todo._id,e)}
                                />
                                <label onDoubleClick={()=>toggleEditing(todo._id)} >{todo.task}</label>
                                <button className="destroy" onClick={()=>{
                                   removeItems(todo._id)
                                }}></button>
                            </div>

                            <input type="text" className='edit' defaultValue={update.length?update:todo.task+update} 
                             onBlur={()=> {toggleEditing(todo._id)}}
                            onBlur={()=>handleUpdate(todo._id)}
                            onChange={(e)=>{setUpdate(e.target.value)}}
                              />
                        </li>)
                       }
                   </ul>
                </div>
                { todos.length > 0 &&

            <footer className='footer'>
             <span className='todo-count'>
               <strong>{remain.length}</strong> tâches à faire
             </span>
             <ul className='filters'>
                <li><a href="#" className={filter==="all"?'selected':''}
                onClick={(e)=>{
                    e.preventDefault()
                    setFilter("all")
                }}>All</a></li>
                <li><a href="#"className={filter==="todo"?'selected':''}
                onClick={(e)=>{
                    e.preventDefault()
                    setFilter('todo')
                }}>Active</a></li>
                <li><a href="#"className={filter==="done"?'selected':''}
                onClick={(e)=>{
                    e.preventDefault()
                    setFilter("done")
                }}>Complete</a></li>
             </ul>

           { done.length > 0 &&  <button className='clear-completed'
             onClick={deleteCompleted}>supprimer tâches restantes</button>}

            </footer>
            }
            </section>
        </div>
    );
};

export default Todo;