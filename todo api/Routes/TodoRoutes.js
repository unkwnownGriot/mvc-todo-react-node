const { response } = require('express')
const express = require('express')
const { findByIdAndUpdate } = require('../model/TodoModel')
const router = express.Router()
const Todo = require('../model/TodoModel')









// Creer un nouveau todo

router.post('/', async (req,res)=>{
    const todo = new Todo({
        task: req.body.task,
    })
  try{
      const newTodo = await todo.save()
      const {task,_id,completed,editing} = newTodo
     const todoToSend = {task,_id,completed,editing}
      res.status(201).send(todoToSend)
  }catch(err){
      res.status(400).json({message:err.message})
  }
})

// récupérer pour lister les todo

router.get('/', async (req,res)=>{
    try{
        const todos = await Todo.find()
        const showToDo = todos.map(item=>{
            const {task,_id,completed,editing} = item
            return {task,_id,completed,editing}
        })
        res.send(showToDo)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// mettre à jour un ou plusieurs todo

router.patch('/', async(req,res)=>{
    var query_id = req.body.id
    var query = req.body
  
     Todo.updateMany({_id:{$in:query_id}},
        {$set:query},(err)=>{
            if(err){
                res.json({message:err.message})
            }else{
                Todo.find((err,result)=>{
                    if(err){
                        res.json({message:err.message})
                    }else{
                        const todoToSend = result.map(item=>{
                            const {task,_id,completed,editing} = item
                            return {task,_id,completed,editing}
                        })
                        res.send(todoToSend)
                    }
                })
            }
        })
 
       
})




// supprimer un ou plusieurs todo 

router.delete('/', (req,res)=>{
    var _ids = req.body.id
   Todo.deleteMany({_id:{ $in: _ids}} ,(err)=>{
       if(err){
           res.send(err.message)
       }else{
        Todo.find((err,result)=>{
            if(err){
                res.json({message:err.message})
            }else{
                const todoToSend = result.map(item=>{
                    const {task,_id,completed,editing} = item
                    return {task,_id,completed,editing}
                })
                res.send(todoToSend)
            }
        })
   }
})
})


module.exports = router