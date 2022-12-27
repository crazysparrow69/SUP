const db = require('../config/db_connection');

const getAllArtifacts = (req, res) => {
    const query = 'SELECT * FROM artifact';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

const getOneArtifact = (req, res) => {
    const query = `SELECT * FROM artifact WHERE id=${req.params.id}`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.sendStatus(404);
        res.status(200).json(result);
    });
};

const createNewArtifact = (req, res) => {
    if (!req.body.name || !req.body.description) return res.status(400).json({ 'message': 'Name and description required' });

    const query = 'INSERT INTO artifact SET ?';
    const artifact = {
        name: req.body.name,
        description: req.body.description
    };
    db.query(query, artifact, (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ 'message': 'New artifact created' });
    });
};

const updateOneArtifact = (req, res) => {
    if (!req.body.name && !req.body.description) return res.status(204).json({ 'message': 'Name or description required' });

    let query = '';
    if (req.body.name) {
        query = `UPDATE artifact SET name = '${req.body.name}' WHERE id = '${req.params.id}'`;
        db.query(query, (err) => { if (err) return res.status(500).json(err) });
    }
    if (req.body.description) {
        query = `UPDATE artifact SET description = '${req.body.description}' WHERE id = '${req.params.id}'`;
        db.query(query, (err) => { if (err) return res.status(500).json(err) });
    }

    res.status(200).json({ 'message': 'Artifact updated' });
};

const deleteOneArtifact = (req, res) => {
    const query = `DELETE FROM artifact WHERE id=${req.params.id}`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ 'message': 'Artifact deleted' });
    });
};

module.exports = { 
    getAllArtifacts,
    getOneArtifact,
    createNewArtifact,
    updateOneArtifact,
    deleteOneArtifact
};