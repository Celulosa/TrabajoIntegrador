function loggedMiddleware(req, res, next) {

   if (req.session.userLogged) {
      return res.redirect('/users/perfilusuario')

   }

next();

   
}
module.exports = loggedMiddleware