const express = require('express')
require("dotenv").config();
const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({extended : true}))
app.use(express.json()) 

const router = require('./routes/index')
app.use(router)

app.listen(PORT, () => {
    console.log('server running on port : ', PORT)
})