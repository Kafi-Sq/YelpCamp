const express = require("express")
const app = express()
const path = require('path')
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')


const campgrounds = require('./routes/campground')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
mongoose.connection
    .once('open', () => {
        console.log('Database Connected')
    })
    .on('error', (err) => {
        console.log(err)
    })

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, ('public'))))
const sessionConfig = {
    secret: 'basicSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(flash())
app.use(session(sessionConfig))

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('errors', { err })
})

app.listen(3000, () => {
    console.log('Listening on port: 3000')
})
