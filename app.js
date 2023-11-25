const express = require('express')
const app = express()
const PORT = 3000

app.use(express.urlencoded({extended : true}))
app.use(express.json()) 

const router = require('./routes/index')
app.use(router)

app.listen(PORT, () => {
    console.log('server running on port : ', PORT)
})