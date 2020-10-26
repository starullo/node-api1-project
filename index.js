const express = require('express');

const generate = require('shortid');

const app = express();

app.use(express.json());

const port = 5005;

let users = [
    {
        id: generate(),
        name: 'Adam Gibson',
        bio: 'I\'m Adam Gibson'
    }
]

app.get('/api/users', (req, res) => {
    try {
    res.status(200).json(users)
    } catch(error) {
        res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        })
    }
})

app.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist." 
        })
    } else {
        try {
        res.status(200).json(user);
        } catch (error) {
            res.status(500).json({
                errorMessage: "The user information could not be retrieved."
            })
        }
    }
})

app.post('/api/users', (req, res) => {
    const {name, bio} = req.body;

    if (!name || !bio || typeof name !== 'string' || typeof bio !== 'string') {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user.'
        })
    } else {
        try {
        const newUser = {
            id: generate(),
            name, bio
        }
        users.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database"
        })
    }
    }
})

app.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const {name, bio} = req.body;
    const indexOfUser = users.findIndex(u => u.id === id);
    if (indexOfUser !== -1 && name && bio) {
        try {
        users[indexOfUser] = {id, name, bio};
        res.status(200).json({id, name, bio})
        } catch (error) {
            res.status(500).json({
                errorMessage: "The user information could not be modified."
            })
        }
    }  else if (indexOfUser !== -1 && (!name || !bio)) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    } else {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }
})

app.delete('/api/users/:id', (req, res)=>{
    const {id} = req.params;
    const user = users.find(u => u.id === id)
    try {
        if (!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        } else {
            users = users.filter(u => !u.id === id);
            res.status(200).json({
                message: 'The user with the id of ' + id + 'was successfully deleted wow'
            })
        }
    } catch (error) {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })
    }
})

app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found!'
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})