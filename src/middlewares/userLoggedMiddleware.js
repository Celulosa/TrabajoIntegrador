// 1- MIDDLEWARE DE APPLICACION PARA HACER QUE EN EL HEADER aparezca la opcion de logearse y crear usaurio si no hay nadie logeado y si hay alguien logeado debe aparecer la pertaña del perfil del usuario y la opcion de log out
// 2- MIDDLEWARE DE APPLICACION para usar la cookie que tiene el email y logear al usuario por el tiempo de la cookie

const db = require('../database/models');//Para importar sequelize

function userLoggedMiddleware(req, res, next) {
    res.locals.isLogged = false;// funcionalidad 1

    let emailInCookie = req.cookies.userEmail;// funcionalidad 2. el emailInCookie es el email ingresado por el usuario cuando se logeó
    //console.log('email in cookie', emailInCookie)
    if (emailInCookie) {
        db.users.findOne({ // funcionalidad 2 usando el email de la cookie busco que ese email este en la base de datos
            where: { email: emailInCookie }
        }).then((userFound) => {
            if (req.session) {
                
                req.session.userLogged = userFound // funcionalidad 2 si el email ingresado esta en la base de datos, entonces todos los datos del usuario de ese email se los paso a la session
                res.locals.isLogged = true;// funcionalidad 1.  Lineas 18 y 19, 26 y 27 se repiten para garantizar que cuando se cierre el navegador, al ingresar aparezca el usurio que estaba logeado antes de cerrar el navegador
                res.locals.userLogged = req.session.userLogged;

            }
        })

    }
    if (req.session.userLogged) {// funcionalidad 1
        res.locals.isLogged = true;// funcionalidad 1
        res.locals.userLogged = req.session.userLogged;// funcionalidad 1...res.locals.userLogged permite usar esta variable en toda la aplicacion y asi podemos mostrar en el header el nombre del usuario

    }



    next()

}

module.exports = userLoggedMiddleware