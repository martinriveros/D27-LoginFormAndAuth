const usersModel = require("../../../config/db");

class UsersHandler {
    
    async protectedContent(req, res) {
      let user = await usersModel.findById(req.session.passport.user)
      res.render("layouts/protectedContent", { loggedUser: user.name });
    }

  async userLoginForm(req, res) {
    let user
    try {
      user = await usersModel.findById(req.session.passport.user)
    } catch (error) {
      console.log('no existe el usuario registrado aun')
    }
       
  if (req.isAuthenticated()) {
      if(req.comesFromRegistro===true){
        return res.render("layouts/userLogin",{ loggedUser: user.name });
      } else {
        return res.redirect("/protectedContent");
      }
    } else {
      return res.render("layouts/userLogin", { loggedUser: 'Gest' })
  }}
  

  async userRegisterForm(req, res) {
    let formErrors = req.formErrors
    if (req.isAuthenticated()) {
      return res.redirect("/protectedContent");
    } else {
      return res.render("layouts/userRegister", {formErrors});
    }
  }

  async userFailLogin(req, res) {
      res.send('fail login')
  }
  async userFailRegistro(req, res) {
      res.send('fail registro')
  }
  async notMatchingRoute(req, res) {
      res.send('el contenido al que estas tratando de llegar no existe')
  }
  async getWelcomePage(req, res, next) {
    res.render("layouts/welcomePage");
  }

  async logout(req, res, next) {
    req.logout();
    req.render('/welcome')
  }


}
module.exports = new UsersHandler();
