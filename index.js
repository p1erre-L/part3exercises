const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const infoPeople = "Phonebook has info for " + persons.length.toString() + " people"
// console.log(infoPeople)

const infoTime = Date(Date.now());
// console.log(infoTime)
const info = "<p>" + infoPeople + "</p><p>" + infoTime + "</p>"
console.log(info)

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((person) => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((person) => person.id !== id)

    response.status(204).end()
})

// const generateId = () => {
//     const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
//     return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//     const body = request.body

//     if (!body.content) {
//         return response.status(400).json({
//             error: 'content missing',
//         })
//     }

//     const note = {
//         content: body.content,
//         important: Boolean(body.important) || false,
//         id: generateId(),
//     }

//     note = notes.concat(note)
//     response.json(note)
// })

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
