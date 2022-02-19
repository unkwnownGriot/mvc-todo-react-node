import React,{useState, useEffect} from 'react';
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
  filteredToDos()
},[filter,playOnce])



var remain = todos.filter(todo => {return !todo.completed})
var done = todos.filter(todo => {return todo.completed})



function task_submit(e){
    e.preventDefault()
    add_task(newTodo)
    setNewTodo("")
}

function add_task(user_task){
    setLoading(true)
    var copyTodo = [...todos]
    if(user_task.trim().length && user_task){
        axios.post('http://localhost:8080/todo/', {
            task:user_task,
          })
          .then(function (response) {
            console.log(response.data);
            copyTodo.push(response.data)
            setTodos(copyTodo)
            setLoading(false)
          })
          .catch(function (error) {
            console.log(error);
          });
        }
        
        
     
}

function removeItems(id_todo){
    setLoading(true)
    var id_delete  = [id_todo]
     axios.delete("http://localhost:8080/todo/",{data:{id:id_delete}}).
     then((response)=>{
         console.log(response.data)
        setTodos(response.data)
        setLoading(false)
     }).catch(err=>console.log(err))
     

  
}

function completeAll(e){
    setLoading(true)
    var check = e.target.checked
    console.log(check)
    var ids = todos.map(el=>{
        return el._id
    })
    console.log(ids)
    axios.patch('http://localhost:8080/todo/',{
        completed:check,
        id:ids
    }).then((response)=>{
        console.log(response.data)
        setTodos(response.data)
        setLoading(false)
    }).catch(err=>console.log(err))
    

}

// fonction pour faire toggler les checkbox et afficher les tâches comme éffectuées

function toggleTodo(id_todo,e){
    setLoading(true)
    var toggle_id = [id_todo]
    axios.patch(`http://localhost:8080/todo/`,{
        completed:e.target.checked,
        id:toggle_id
    }).then((response)=>{
        console.log(response.data) 
        setTodos(response.data)
        setLoading(false)    
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
    var update_id = [todo_id]
    if(update.length && e.key=="Enter"){
        setLoading(true)
    axios.patch(`http://localhost:8080/todo/`,{
        task:update,
        id:update_id
    }).then((response)=>{
        console.log(response.data)
         setTodos(response.data)
         setLoading(false)
    }).catch(err=>console.log(err))
    
}

}




// fonction pour supprimer les tâches restantes

function deleteCompleted(){
    setLoading(true)
    var deleted = todos.filter(item=>{
        return item.completed === true
    })
    var deleted_id = deleted.map(el=>{
        return el._id
    })
    axios.delete('http://localhost:8080/todo/',{
        data:{id:deleted_id}}).then((response)=>{
        console.log(response.data)
        setTodos(response.data)
         setLoading(false)
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
                    checked={remain.length===0?true:false}
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
                            onChange={(e)=>{setUpdate(e.target.value)}}
                            onKeyPress={(e)=>{handleUpdate(todo._id,e)}}
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