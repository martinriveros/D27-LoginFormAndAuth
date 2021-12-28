const LocalStrategy = require('passport-local').Strategy
const mongoose = requiere('mongoose');
const bcrypte = require ('bycryptjs');
const usersModel = require('./db')


module.exports = passport => {
    passport.use(
        new LocalStrategy({usernameField:'email'}, async (email, password, donde)=>{
            // check for exsiting email already registered
            try {
                let storedUser = await usersModel.findOne({email})
                if(!storedUser){
                    return done(null, false, {message:'email no registrado'})
                }
            } catch (error) {
                console.log('error en el callback de passport ', error)
            }
        })


    )
}