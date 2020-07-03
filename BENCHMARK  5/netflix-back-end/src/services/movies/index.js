const express = require("express")
const path = require("path")
const fs = require("fs-extra")
const { join } = require("path")
const { readDB, writeDB } = require("../../utilities")

const moviesJsonPath = path.join(__dirname, "movies.json")
const moviesRouter = express.Router()

// GET ALL MOVIES
moviesRouter.get("/", async (req, res, next) => {
  try {
    const data = await readDB(moviesJsonPath)
    res.send({ numberOfItems: data.length, data })
  } catch (error) {
    console.log(error)
    const err = new Error("A problem occurred!")
    next(err)
  }
})
// GET ONE SINGLE MOVIE
moviesRouter.get("/:imdbID", async (req, res, next) => {
  try {
    const movies = await readDB(moviesJsonPath)
    const movie = movies.find((b) => b.imdbID === req.params.imdbID)
    if (movie) {
      res.send(movie)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading movies list a problem occurred!")
  }
})
// EDIT A MOVIE
moviesRouter.put("/:imdbID", async (req, res, next) => {
  try {
    const movies = await readDB(moviesJsonPath)
    const movie = movies.find((b) => b.imdbID === req.params.imdbID)
    if (movie) {
      const position = movies.indexOf(movie)
      const movieUpdated = { ...movie, ...req.body } // In this way we can also implement the "patch" endpoint
      movies[position] = movieUpdated
      await writeDB(moviesJsonPath, movies)
      res.status(200).send("Updated")
    } else {
      const error = new Error(`movie with imdbID ${req.params.imdbID} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})
// DELETE A MOVIE
moviesRouter.delete("/:imdbID", async (req, res, next) => {
  try {
    const movies = await readDB(moviesJsonPath)
    const movie = movies.find((b) => b.imdbID === req.params.imdbID)
    if (movie) {
      await writeDB(
        moviesJsonPath,
        movies.filter((x) => x.imdbID !== req.params.imdbID)
      )
      res.send("Deleted")
    } else {
      const error = new Error(`movie with imdbID ${req.params.imdbID} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = moviesRouter
