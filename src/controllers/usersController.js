const { validationResult } = require('express-validator');// importa los resultados de las validaciones
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));


const controlador = {

    login: (req, res) => {
        res.render('users/login');
    },

    check: (req, res) => {

        let currentUser = "";
        let contador = 0
        let password = req.body.contrasena
        let email = req.body.email;
        email = email.toLowerCase();
        //console.log('el password ingresado es: ' + password)
        //console.log('el email ingresado es: ' + email)
        for (let obj of users) {
            if ((password == obj.contrasena) & (email == obj.email)) {
                currentUser = obj
                console.log(currentUser)
                contador = 1
                break;
            } 
        }

        if (contador == 1) {
            res.render('users/perfilusuario', { usuario: currentUser });
        } else{
           res.send('Usuario o contraseña Erronea o NO existen');
 
        }
          
    },

    edit: (req, res) => {

        let idUser = req.params.id;
        let UserSelected = "";

        for (let obj of users) {
            if (idUser == obj.id) {
                UserSelected = obj;
                break;
            }
        }

        res.render('users/editarUsuario', { usuario: UserSelected });

    },

    update: (req, res) => {

        let userToEdit = req.params.id;

       // console.log('el usuario es:' + userToEdit);
        for (let obj of users) {
            if (userToEdit == obj.id) {
                obj.nombre = req.body.nombre
                obj.apellido = req.body.apellido
                obj.email = req.body.email
                obj.cumpleanos = req.body.cumpleanos
                obj.direccion = req.body.direccion
                obj.contrasena = req.body.contrasena
                break;

            }
        }
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, " "));

        res.redirect('/');
    

    },


    registro: (req, res) => {
        res.render('users/registro');
    },

    guardarusuario: (req, res) => {

        let errors = validationResult(req);
        console.log("errors", errors)

        if (errors.isEmpty()){
        let nuevoUsuario = {
            id: (users[users.length - 1].id) + 1,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            cumpleanos: req.body.cumpleanos,
            direccion: req.body.direccion,
            contrasena: req.body.contrasena,

        };

        users.push(nuevoUsuario);

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, " "));

        res.redirect('/');

    } 
    else {
        res.render('users/registro',{errors:errors.array()})
    }
},

    destroy: (req, res) => {
        let userToDelete = req.params.id;
       
         let arrayUsers= users.filter(function (objetos){
             return objetos.id != userToDelete
        })
        

        fs.writeFileSync(usersFilePath, JSON.stringify(arrayUsers, null, " "));

        res.redirect('/');
    }

}


module.exports = controlador;

