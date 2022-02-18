const express = require('express')
const router = express.Router()
const Todo = require('../model/TodoModel')




// Creer un nouveau todo

router.post('/', async (req,res)=>{
    const todo = new Todo({
        task: req.body.task,
    })

    try{
         await todo.save()
        res.status(200).send({message:'todo crée avec succès'})
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

// mettre à jour un todo

router.patch('/:id', async(req,res)=>{
    var query_id = req.params.id
    var query = req.body
    console.log(query)
    try{
           await Todo.findByIdAndUpdate({_id:query_id},{$set:query},
            {new:true})
            res.status(201).json({message:'todo mis à jour'})
    }catch(err){
        res.status(404).json({message:err.message})
    }
   
})

// mettre à jour plusieurs todo

router.patch('/',async(req,res)=>{
    var query = req.body
    try{
        const udpada = await  Todo.updateMany({},{$set:{completed:query.completed}})
        res.status(201).json({message:udpada})
    }catch(err){
        res.status(404).json({message:err.message})
        console.log(err.message)
        
    }
})

// supprimer un todo

router.delete('/:id', async(req,res)=>{
   var query_id = req.params.id
   try{
        await Todo.findByIdAndRemove({_id:query_id})
       res.json({message:"le todo a été supprimé"})
   }catch(err){
         res.status(500).json({message:err.message})
   }

    
})

// supprimer plusieurs todo 

router.delete('/', (req,res)=>{
    var _ids = req.body.id
   Todo.deleteMany({_id:{ $in: _ids}} ,(err,result)=>{
       if(err){
           res.send(err.message)
       }else{
           res.send(result)
       }
   })
})



module.exports = router