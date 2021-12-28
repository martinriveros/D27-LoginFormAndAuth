const { Router } = require('express');
const router = Router();
const usersHandler = require('../components/users/usersHandler')

module.exports = (app)=> {

  app.use("/", router);

  router.get('/registro', isLogged,usersHandler.userRegisterForm)
  router.post('/registro', usersHandler.userRegister)
  
  router.get('/login', isLogged,usersHandler.userLoginForm)
  router.post('/login', usersHandler.userLogin)

  router.get('/protectedContent', isLoggedVerify,usersHandler.protectedContent)

  router.get('/welcome', usersHandler.getWelcomePage)
}

function isLogged (req, res, next){
  if(req.session.isLogged){
    res.redirect('/protectedContent')
  } else {
    next()
  }
}
function isLoggedVerify(req, res, next){
  if(req.session.isLogged){
    next()
  } else {
    res.redirect('/login')
  }
}

