const express = require("express");
const router = express.Router();
const { Genres, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");

async function getGenres() {
  return await Genres.find().sort("name");
}

async function getGenreById(id) {
  return await Genres.findById(id);
}

async function createGenre(genre) {
  const genreModel = new Genres(genre);
  return await genreModel.save();
}

async function updateGenre(id, updateObject) {
  return await Genres.findByIdAndUpdate(
    id,
    {
      $set: updateObject
    },
    { new: true }
  );
}

router.get("/", async (req, res) => {
  const genres = await getGenres();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await getGenreById(req.params.id);
  if (!genre)
    return res
      .status(404)
      .send(`A genre with id ${req.params.id} was not found!`);
  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genres.findByIdAndRemove(req.params.id);
  if (!genre)
    return res
      .status(404)
      .send(`A genre with id ${req.params.id} was not found!`);
  res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const matchedGenre = await Genres.find({ name: req.body.name });

  if (
    matchedGenre &&
    matchedGenre.length > 0 &&
    matchedGenre[0]._id != req.params.id
  )
    return res.status(400).send("Another genre with this name already exists");

  const updated = await updateGenre(req.params.id, req.body);
  if (!updated)
    return res
      .status(404)
      .send(`A genre with id ${req.params.id} was not found!`);
  res.send(updated);
  console.log(`Genre ${req.params.id} updated successfully`);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const matchedGenre = await Genres.find({ name: req.body.name });

  if (matchedGenre && matchedGenre.length > 0)
    return res.status(400).send("Another genre with this name already exists");

  const newGenre = await createGenre(req.body);
  res.send(newGenre);
});

module.exports = {
  router: router,
  database: {
    createGenre: createGenre,
    getById: getGenreById
  }
};
