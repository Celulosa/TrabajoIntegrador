const e = require('express');
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
        // Codigo para verificar las credenciales del login, si son correctas lleva a la vista perfil del usuario, de lo contrario muestra un mensaje de erro
        let currentUser = "";
        let password = req.body.contrasena
        let email = req.body.email;
        email = email.toLowerCase();
        let flag = 0

        for (let i = 0; i < users.length; i++) {
            if ((password == users[i].contrasena) & (email == users[i].email)) {
                currentUser = users[i]
                flag = 1
                res.render('users/perfilusuario', { usuario: currentUser });
                break;
            }
        }
        if (flag == 0) {
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
        //Codigo desde linea 88 hasta la linea 100, verifica si el correo ya existe, si no existe empieza validaciones in la linea 101
        let correo = req.body.email
        let correoValidacion = users.findIndex(function (elemento) {
            if (correo == elemento.email)
                return true
        })
        console.log(correoValidacion)

        if (correoValidacion != -1) {
            res.send('Usuario ya existe. Por favor dirijase al link de Login')

        }
        else {

            let errors = validationResult(req);
            console.log("errors", errors)

            if (errors.isEmpty()) {
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
                res.render('users/registro', { errors: errors.array() })
            }
        }

    },

    destroy: (req, res) => {
        let userToDelete = req.params.id;

        let arrayUsers = users.filter(function (objetos) {
            return objetos.id != userToDelete
        })


        fs.writeFileSync(usersFilePath, JSON.stringify(arrayUsers, null, " "));

        res.redirect('/');
    }

}


module.exports = controlador;

