const express = require('express');
const router = express.Router();
const { getAllArtifacts, getOneArtifact, createNewArtifact, updateOneArtifact, deleteOneArtifact } = require('../controllers/apiController');

router.get('/', getAllArtifacts)
      .get('/:id', getOneArtifact)
      .post('/', createNewArtifact)
      .put('/:id', updateOneArtifact)
      .delete('/:id', deleteOneArtifact);

module.exports = router;