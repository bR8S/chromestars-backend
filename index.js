import { run } from './test.js'
import express, { json } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const db = {
    todos: []
}

const app = express()
app.use(express.json())

app.get('/todo', (req, res) => {
    res.json({ data: db.todos })
})

app.post('/todo', (req, res) => {
    const text = req.body.text
    const newTodo = { id: Date.now(), text: text }
    db.todos.push(newTodo)
    res.json({ data: newTodo })
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})  