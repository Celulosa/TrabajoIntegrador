const { validationResult } = require('express-validator');// importa los resultados de las validaciones
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs')//Libreria para encriptar el password

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));


const controlador = {

    login: (req, res) => {
        res.render('users/login');
    },

    loginCheck: (req, res) => {
        // Codigo para verificar las credenciales del login, si son correctas lleva a la vista perfil del usuario, de lo contrario muestra un mensaje de error
        let currentUser = "";
        let password = req.body.contrasena;
        let email = req.body.email;
        email = email.toLowerCase();
        let flag = 0
        for (let i = 0; i < users.length; i++) {
            if ((bcrypt.compareSync(password, users[i].contrasena)) && (email == users[i].email)) {
                currentUser = users[i]
                flag = 1
                req.session.userLogged = currentUser //para cargar el usuario logeado en la variable userLogged de session
                if (req.body.recordame) {
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 2 }) // pongo el email que ingreso el usuario en la cookie llamada userEmail
                }
                res.redirect('/users/perfilusuario');
                break;
            }
        }
        if (flag == 0) {
            res.render('users/login', {
                errors: {
                    email: {
                        msg: 'Credenciales inválidas!'
                    }
                },
                old: req.body
            })
        }
    },

    perfil: (req, res) => {
        res.render('users/perfilusuario', { usuario: req.session.userLogged });
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
                //obj.email = req.body.email
                obj.cumpleanos = req.body.cumpleanos
                obj.direccion = req.body.direccion
                obj.contrasena = bcrypt.hashSync(req.body.contrasena, 10)
                //obj.avatar = req.body.avatar
                break;
            }
        }
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, " "));

        res.clearCookie('userEmail');
        req.session.destroy();
        res.redirect('/');
    
 
        
    },
    

    registro: (req, res) => {
        res.render('users/registro');
    },

    guardarusuario: (req, res) => {
        //Codigo desde linea 88 hasta la linea 100, verifica si el email ya existe, si el email no existe empieza validaciones in la linea 106
     
            let correo = req.body.email
            let correoValidacion = users.findIndex(function (elemento) {
                if (correo == elemento.email)
                    return true
            })
        
        if (correoValidacion != -1) {

            res.render('users/registro', {
                errors: {
                    email: {
                        msg: 'Este e-mail ya esta registrado. Por favor vaya a '
                    }
                },
                old: req.body
            })
        }
        else {
            let errors = validationResult(req);
            if (errors.isEmpty()) {
                if (!req.file) {
                    res.render('users/registro', {
                        errors: {
                            avatar: {
                                msg: 'Por favor cargue una imagen '
                            }
                        },
                        old: req.body
                    })
                }
           
                let nuevoUsuario = {
                    id: (users[users.length - 1].id) + 1,
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email,
                    cumpleanos: req.body.cumpleanos,
                    direccion: req.body.direccion,
                    contrasena: bcrypt.hashSync(req.body.contrasena, 10),
                    avatar: req.file.filename //esta es una propiedad de Multer que trae el nombre de la imagen a cargar
                };
                users.push(nuevoUsuario);
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, " "));
                res.redirect('/users/login');
            }
            else {
                console.log(req.body)
                res.render('users/registro', { errors: errors.array(), old: req.body })
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
    },

    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        res.redirect('/');
    }
}


module.exports = controlador;

