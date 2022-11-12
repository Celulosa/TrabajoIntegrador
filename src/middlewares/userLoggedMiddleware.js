// 1- MIDDLEWARE DE APPLICACION PARA HACER QUE EN EL HEADER aparezca la opcion de logearse y crear usaurio si no hay nadie logeado y si hay alguien logeado debe aparecer la pertaña del perfil del usuario y la opcion de log out
// 2- MIDDLEWARE DE APPLICACION para usar la cookie que tiene el email y logear al usuario por el tiempo de la cookie


// Importo el JSON con los usuarios
const e = require('express');
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));



function userLoggedMiddleware(req,res,next){
    res.locals.isLogged = false; // funcionalidad 1

    let emailInCookie = req.cookies.userEmail;// funcionalidad 2. el emailInCookie es el email ingresado por el usuario cuando se logeó
   
    for (let i = 0; i< users.length; i++){// funcionalidad 2 usando el email de la cookie busco que ese email este en la base de datos (Json)
        if( emailInCookie == users[i].email){// funcionalidad 2
            req.session.userLogged = users[i]// funcionalidad 2 si el email ingresado esta en la base de datos, entonces todos los datos del usuario de ese email se los paso a la sessio
        }
    }


    if(req.session.userLogged){// funcionalidad 1
    res.locals.isLogged = true;// funcionalidad 1
    res.locals.userLogged = req.session.userLogged;// funcionalidad 1...res.locals.userLogged permite usar esta variable en toda la aplicacion y asi podemos mostrar en el header el nombre del usuario

} 
    

next()
}

module.exports= userLoggedMiddleware