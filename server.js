
require("dotenv").config()
const express = require("express")
const app = express()
const Url = require("./models/url")
const connectDB = require("./db")
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const urlsRoute = require("./routes/urlsRoute")
app.use("/api", urlsRoute)
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

app.get("/:urlId", async(req, res) => {
    const urlId = req.params.urlId
    try {
        const url = await Url.findOne({urlId})
        if(!url){
            res.status(400).send("Invalid Url")
        }
        else{
            url.clicks++
            await url.save()
            res.redirect(url.origUrl)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

const PORT = 5000
app.listen(PORT,()=>{console.log(`Server started at PORT ${PORT}`)})
