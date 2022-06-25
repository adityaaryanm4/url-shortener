require("dotenv").config()

const { request } = require("express")
const express = require("express")
const router = express.Router()

const shortId = require("shortid")

const Url = require("../models/url")

const isValidUrl = require("../validateUrl")

router.post("/short", async (req, res) => {
    const { origUrl } = req.body
    if (isValidUrl(origUrl)) {
        try {
            const url = await Url.findOne({ origUrl: origUrl })
            if (url) {
                res.send(url)
            }
            else {
                const urlId = shortId.generate()
                const base = process.env.BASE
                const shortUrl = base + urlId
                const newRecord = new Url({
                    urlId,
                    origUrl,
                    shortUrl
                })
                await newRecord.save()
                res.send(shortUrl)
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }
    else {
        res.status(400).send("Invalid Url")
    }
})


module.exports = router




