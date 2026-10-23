/* const express = require('express')

const routes = require('./routes')
const requestLogger = require('./middleware/requestLogger')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())

app.use(requestLogger)

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'ok'
        }
    })
})

app.use('/api/v1', routes)

app.use(notFound)

app.use(errorHandler)

module.exports = app */




const express = require('express')
const routes = require('./routes')
//const healthRoutes = require('./routes/health.routes')
const requestLogger = require('./middleware/requestLogger')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const {API_PREFIX} = require('./config/constants')


/**
 * builds express app and starts db connection
 * 
 * order for middleware is:
    * logger -> bodyparser -> health -> API routes -> 404 -> error handler
 */

const app = express()

app.use(requestLogger)
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true, limit:'10kb'}))

//app.use('/health', healthRoutes)
app.use(API_PREFIX, routes)

app.use(notFound)
app.use(errorHandler)

module.exports = app