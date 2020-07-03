const express = require("express")
const path = require("path")
const fs = require("fs-extra")
const { join } = require("path")
const { readDB, writeDB } = require("../../utilities")

const reviewsJsonPath = path.join(__dirname, "reviews.json")
const reviewsRouter = express.Router()


// reviewsRouter.post("/:imdbID/reviews", async (req, res, next) => {
//     console.log("Adding")
//     const reviews = await readDB(reviewsJsonPath)
//     const review = reviews.find((b) => b.imdbID === req.params.imdbID)
//     if (review) {
//         const reviews = await readDB(reviewsJsonPath)
//         reviews.push({ ...req.body, createdAt: new Date(), reviewID: req.params.imdbID })
//         await writeDB(reviewsJsonPath, reviews)
//         res.send("OK")
//     }
//     else {
//         const error = new Error(`review with imdbID ${req.params.imdbID} not found`)
//         error.httpStatusCode = 404
//         next(error)
//     }
// })

// GET ALL REVIEWS
reviewsRouter.get("/", async (req, res, next) => {
    try {
        const data = await readDB(reviewsJsonPath)
        res.send({ numberOfItems: data.length, data })
    } catch (error) {
        console.log(error)
        const err = new Error("A problem occurred!")
        next(err)
    }
})
// GET A SINGLE REVIEW
reviewsRouter.get("/:imdbID", async (req, res, next) => {
    try {
        const reviews = await readDB(reviewsJsonPath)
        const review = reviews.find((b) => b.imdbID === req.params.imdbID)
        if (review) {
            res.send(review)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        next("While reading reviews list a problem occurred!")
    }
})
// UPDATE A REVIEW
reviewsRouter.put("/:imdbID", async (req, res, next) => {
    try {
        const reviews = await readDB(reviewsJsonPath)
        const review = reviews.find((b) => b.imdbID === req.params.imdbID)
        if (review) {
            const position = reviews.indexOf(review)
            const reviewUpdated = { ...review, ...req.body }
            // vendosim patch endpoint
            reviews[position] = reviewUpdated
            await writeDB(reviewsJsonPath, reviews)
            res.status(200).send("Updated")
        } else {
            const error = new Error(`review with imdbID ${req.params.imdbID} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})
// DELETE A REVIEW
reviewsRouter.delete("/:imdbID", async (req, res, next) => {
    try {
        const reviews = await readDB(reviewsJsonPath)
        const review = reviews.find((b) => b.imdbID === req.params.imdbID)
        if (review) {
            await writeDB(
                reviewsJsonPath,
                reviews.filter((x) => x.imdbID !== req.params.imdbID)
            )
            res.send("Deleted")
        } else {
            const error = new Error(`review with imdbID ${req.params.imdbID} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

module.exports = reviewsRouter
