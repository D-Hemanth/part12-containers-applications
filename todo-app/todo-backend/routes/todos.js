const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()
const { getAsync, setAsync } = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

// http://localhost:3000/todos/statistics route in redis server for counting the todos added to the mongodb
router.get('/statistics', async (_, res) => {
  const todosCount = await getAsync('count')
  // console.log('todos count:', todosCount)
  res.send({ added_todos: todosCount || 0 })
})

const todosCounter = async () => {
  const count = await getAsync('count')
  // console.log('count', count)
  // use parseInt to convert the string todos count value from getAsync to a number cause key:value pairs are string values in redis
  return count ? setAsync('count', parseInt(count) + 1) : setAsync('count', 1)
}

/* POST todo to listing. */
router.post('/', async (req, res) => {
  // when a new todo is created automatically callback todoCounter function
  todosCounter()

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })
  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  // console.log('request id params', req.params)
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  // console.log('request body text & done:', text, done)
  // console.log('request todo from findByIdMiddleware', req.todo)
  const response = await req.todo.updateOne({ text, done })
  res.send(response)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
