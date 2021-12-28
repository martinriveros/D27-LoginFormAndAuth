const usersModel = require('../../config/db')
const bcrypt = require ('bcryptjs')
const path = require('path')

class UsersHandler{
    
    async protectedContent(req, res){
        let loggedUser = req.session.username
        res.render('layouts/protectedContent', {loggedUser})}
        
    async userLoginForm(req, res){

        if(req.session.isAuth){
            return res.redirect('/protectedContent')
          } else {
            return res.render('layouts/userLogin')
        }
   }
        
    async userRegisterForm(req, res){

        if(req.session.isAuth){
            return res.redirect('/protectedContent')
          } else {
            return res.render('layouts/userRegister')}
        } 
            
    async userLogin(req, res) {
                        
        const {email, password} = req.body
    
        let user = await usersModel.findOne({email})
  
        if(!user) {
            res.redirect('/login')
        }else{
            let matchPassword = await bcrypt.compare(password, user.password)
        
        if(matchPassword){
            
            req.session.isLogged = true
            req.session.username = user.username
                      
            res.redirect('/protectedContent')
        }else{
            res.redirect ('/login')}
     }}

     async getWelcomePage(req, res, next){
         res.render('layouts/welcomePage')
     }
    
    
    async userRegister(req, res, next){
        const {email, password, username, rePassword} = req.body
        let registeredUser = await usersModel.findOne({email})
        let errors = [];

        // check for requires fields
    
        if(!email || !password || !username || !rePassword){
            errors.push({field: "CAMPOS", msg: "completalos TODOS"})
        }

        // check passwords match

        if(password!==rePassword){
            errors.push({field: "CONTRASENA", msg:"no COINCIDEN"})
        }
        // check password length
        
        if(password.length<4){
            errors.push({field: "CONTRASENA", msg:"deben tener AL MENOS 4 CARACTERES"})
        }
        
        if(registeredUser) {
            errors.push({field: "EMAIL", msg:"YA EXISTE, proba con OTRO"})
         }
        
        if(errors.length===0){
                let hashedPassword = await bcrypt.hash(password, 12) // password encryption
                
                let user = new usersModel({
                    username,
                    email,
                    password: hashedPassword})
                
                try{
                    await user.save()
                } catch (error){
                    console.log('error al guardar el usuario ', error)
                }
                req.flash('Bien!',`ya estas registrado ${username}, presiona Loguear`)
                return res.render(path.join(__dirname, '../../views/layouts/userlogin'), {email, password})
            }
        else{
            console.log(errors, email, password, rePassword, username)

            return res.render(path.join(__dirname, '../../views/layouts/userRegister'), {errors, email, password, rePassword, username})
        }

}
}
module.exports = new UsersHandler()