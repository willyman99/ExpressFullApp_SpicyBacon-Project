const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/user.model')

// Base
router.get('/', (req, res) => {
    res.render('pages/auth/index')
})


// Signup form page (get)
router.get('/signup', (req, res) => {
    res.render('pages/auth/signup')
})


// Signup button (post)
router.post('/signup', (req, res, next) => {

    const { username, pwd } = req.body

    User
        .findOne({username})
        .then(user => {
            if (user) {
                res.render('pages/auth/signup', { errorMessage: 'Name Not Available' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(pwd, salt)
            User
                .create({ username, password: hashPass })
                .then(() => res.render('pages/auth/login', { errorMessage: 'User Registered. Please Login' }))
                .catch(err => {
                    if (err instanceof mongoose.Error.ValidationError) {
                        console.log(err.errors)
                    } else {
                        next()
                    }
                })
        })
        .catch(err => console.log('error', err))
})


// Login form page (get)
router.get('/login', (req, res) => {
    res.render('pages/auth/login')
})


// Login button (post)
router.post('/login', (req, res) => {

    const { username, pwd } = req.body

    User
        .findOne({username})
        .then(user => {
            if (!user) {
                res.render('pages/auth/login', { errorMessage: 'User Not Recognized' })
                return
            }
            if (bcrypt.compareSync(pwd, user.password) === false) {
                res.render('pages/auth/login', { errorMessage: 'Incorrect Password' })
                return
            }
            req.session.currentUser = user
            res.redirect('/user')
        })
        .catch(err => console.log('error', err))
})


//Close session button (get)
router.get('/exit', (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/auth/login")
    })
})

module.exports = router