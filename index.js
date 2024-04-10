const express = require('express')
const morgan = require('morgan')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})


const generateInfo = (persons) => {
    console.log("persons in generateinfo :", persons)
    const infoPeople = "Phonebook has info for " + persons.length.toString() + " people"
    const infoTime = Date(Date.now());
    return "<p>" + infoPeople + "</p><p>" + infoTime + "</p>"
}

app.get('/info', (request, response, next) => {
    Person.find({})
        .then(persons => {
            console.log("persons in find :", persons)
            // response.send(generateInfo(persons))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
})

app.post('/api/persons', async (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({
            error: 'name missing',
        })
    }

    if (body.number === undefined) {
        return response.status(400).json({
            error: 'number missing',
        })
    }

    try {
        let person = await Person.findOne({ name: body.name })

        if (person) {
            person.number = body.number
        } else {
            person = new Person({
                name: body.name,
                number: body.number
            })
        }

        const savedPerson = await person.save()
        response.json(savedPerson)
    } catch (error) {next(error)}


    // if (duplicatePerson) {
    //     app.put('/api/persons/:id', (request, response, next) => {
    //         const person = {
    //             name: body.name,
    //             number: body.number
    //         }

    //         Person.findByIdAndUpdate(request.params.id, person, {new:true})
    //             .then(updatePerson => {
    //                 response.json(updatePerson)
    //             })
    //             .catch(error => next(error))
    //     })
    // }

    // const person = new Person({
    //     name: body.name,
    //     number: body.number,
    // })
    

    // person.save().then(savedPerson => {
    //     response.json(savedPerson)
    // })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
