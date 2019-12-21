import express from 'express';
import cors from 'cors';
import db from './data/db';

const {
    find,
    findById,
    insert,
    update,
    remove,
  } = db;

const server = express();
server.use(express.json());
server.use(cors());

server.get('/api/users', (req, res) => {
    find()
        .then(allUsers => {
            res.json(allUsers);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ err: `${id} is not a valid user id` });
    }

    findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ err: 'User not found'})
            }
        })
        .catch(err => res.status(500).json(err));
});

server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    if(!name || !bio) {
        return res.status(400).json({ err: 'Missing field(s): name and bio must be provided'})
    }

    insert(req.body)
        .then(responseObj => {
            res.status(201).json(responseObj);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ err: `${id} is not a valid user id` });
    }

    if(!name && !bio) {
        return res.status(400).json({ err: 'Please specify a field to by updated (name or bio)' });
    }

    update(id, req.body)
        .then(result => {
            if (result === 1) {
                res.status(200).json({ message: "Updated Successfully"});
            } else {
                res.status(404).json({ err: 'No such user exists'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ err: `${id} is not a valid user id` });
    }

    remove(id)
        .then(result => {
            if(result ===  1) {
                res.status(200).json({ message: 'User successfully deleted.' });
            } else {
                res.status(404).json({ err: 'No such user exists.' });
            }
        })
        .catch(err => res.status(500).json(err));
});

server.listen(8000, () => console.log('server running on port 8000'));
