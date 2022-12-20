const { validationResult } = require('express-validator');// importa los resultados de las validaciones
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs')//Libreria para encriptar el password



const db = require('../database/models');//Para importar sequelize
const { UniqueConstraintError } = require('sequelize');
const Op = db.Sequelize.Op;//para usar los operadores de sequelize


const controlador = {

    login: (req, res) => {
        return res.render('users/login');
    },

    loginCheck: (req, res) => {
        // Codigo para verificar las credenciales del login, si son correctas lleva a la vista perfil del usuario, de lo contrario muestra un mensaje de error
        let password = req.body.contrasena;
        let correo = req.body.email;
        correo = correo.toLowerCase();
        let flag = 0
        db.users.findOne({
            where: { email: correo, borrar: 0 }
        }).then((usuario) => {
            if (usuario) {
                if (bcrypt.compareSync(password, usuario.contrasena)) {
                    flag = 1
                    req.session.userLogged = usuario //para cargar el usuario logeado en la variable userLogged de session
                    if (req.body.recordame) {
                        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 100 }) // pongo el email que ingreso el usuario en la cookie llamada userEmail
                    }
                    if (usuario.tipoUsuario == 'general') {
                        req.session.usuarioTipo = 'general'//para cambiar el tipo de header(general, admin o super) en el perfil del usuario
                        res.redirect('/products/listadoproductos')
                    }
                    if (usuario.tipoUsuario == 'super') {
                        req.session.usuarioTipo = 'super'
                        res.redirect('/')
                    }
                    if (usuario.tipoUsuario == 'admin') {
                        req.session.usuarioTipo = 'admin'
                        res.redirect('/')
                    }

                }
            } if (flag == 0) {
                //res.send('CREDENCIALES INVALIDAS')

                res.render('users/login', {
                    errors: {
                        email: {
                            msg: 'Credenciales inválidas!'
                        }
                    },
                    old: req.body
                })
            }
        })
        return;

    },


    perfil: (req, res) => {
        if (req.session.usuarioTipo == 'general') {
            return res.render('users/perfilusuario', { usuario: req.session.userLogged });
        }
        if (req.session.usuarioTipo == 'admin') {
            return res.render('users/perfilgerente', { usuario: req.session.userLogged });
        }
        if (req.session.usuarioTipo == 'super') {
            return res.render('users/perfilgerente', { usuario: req.session.userLogged });
        }

    },

    edit: (req, res) => {

        db.users.findByPk(req.params.id).then((userSelected) => {
            res.render('users/editarUsuario', { usuario: userSelected });
        })
        return;
    },


    update: (req, res) => {
        db.users.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            cumpleanos: req.body.cumpleanos,
            direccion: req.body.direccion,
            contrasena: bcrypt.hashSync(req.body.contrasena, 10)
            //avatar = req.body.avatar

        }, {
            where: { id: req.params.id }
        })

        res.clearCookie('userEmail');
        req.session.destroy();
        res.redirect('/');

    },


    registro: (req, res) => {
        return res.render('users/registro');
    },

    guardarusuario: (req, res) => {

        db.users.findOne({
            where: { email: req.body.email }
        })
            .then((resultado) => {
                if (resultado && req.body.email != '') {
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
                        if (!req.file) { // revisa si no se cargo ninguna imagen y si no se cargo arroja un error, de lo contrario permite la creacion del usuario
                            res.render('users/registro', {// si no se cargo la imagen, envia el error al formulario de registro
                                errors: {
                                    avatar: {
                                        msg: 'Por favor cargue una imagen '// si no se cargo la imagen, envia el error al formulario de registro
                                    }
                                },
                                old: req.body //permite que el formulario no se borre luego del error y permanezca con los datos ingresados por el usuario
                            })
                        } else {

                            db.users.create({
                                nombre: req.body.nombre,
                                apellido: req.body.apellido,
                                email: req.body.email,
                                cumpleanos: req.body.cumpleanos,
                                direccion: req.body.direccion,
                                contrasena: bcrypt.hashSync(req.body.contrasena, 10),
                                avatar: req.file.filename, //esta es una propiedad de Multer que trae el nombre de la imagen a cargar
                                tipoUsuario: 'general',
                                borrar: false, // para implementar un borrado logico
                                local_id: req.body.local_id
                            })
                            //res.send('Usuario creado existosamente') //como hacer que luego de este mensaje espere 3 segundos y me redirija al home
                            res.render('users/login', {// si no se cargo la imagen, envia el error al formulario de registro
                                errors: {
                                    userCreado: {
                                        msg: 'Usuario creado existosamente. Por favor ingrese '// si no se cargo la imagen, envia el error al formulario de registro
                                    }
                                },
                                old: req.body //permite que el formulario no se borre luego del error y permanezca con los datos ingresados por el usuario
                            })

                        }
                    }
                    else {

                        res.render('users/registro', { errors: errors.array(), old: req.body })
                    }
                }
            })
        return;
    },
    registrogerente: (req, res) => {
        if (req.session.usuarioTipo == 'super') {
            return res.render('users/creargerente');
        }
    },
    creargerente: (req, res) => {

        db.users.findOne({
            where: { email: req.body.email }
        })
            .then((resultado) => {
                if (resultado && req.body.email != '') {
                    res.render('users/creargerente', {
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
                        if (!req.file) { // revisa si no se cargo ninguna imagen y si no se cargo arroja un error, de lo contrario permite la creacion del usuario
                            res.render('users/creargerente', {// si no se cargo la imagen, envia el error al formulario de registro
                                errors: {
                                    avatar: {
                                        msg: 'Por favor cargue una imagen '// si no se cargo la imagen, envia el error al formulario de registro
                                    }
                                },
                                old: req.body //permite que el formulario no se borre luego del error y permanezca con los datos ingresados por el usuario
                            })
                        } else {

                            db.users.create({
                                nombre: req.body.nombre,
                                apellido: req.body.apellido,
                                email: req.body.email,
                                cumpleanos: req.body.cumpleanos,
                                direccion: req.body.direccion,
                                contrasena: bcrypt.hashSync(req.body.contrasena, 10),
                                avatar: req.file.filename, //esta es una propiedad de Multer que trae el nombre de la imagen a cargar
                                tipoUsuario: 'admin',
                                borrar: 0, // para implementar un borrado logico
                                local_id: req.body.local_id
                            })
                            //res.send('Usuario creado existosamente') //como hacer que luego de este mensaje espere 3 segundos y me redirija al home
                            /*res.render('users/listadogerentes', {// si no se cargo la imagen, envia el error al formulario de registro
                                errors: {
                                    userCreado: {
                                        msg: 'Usuario creado existosamente. Por favor ingrese '// si no se cargo la imagen, envia el error al formulario de registro
                                    }
                                },
                                old: req.body //permite que el formulario no se borre luego del error y permanezca con los datos ingresados por el usuario
                            })*/
                            res.redirect('/users/listadogerentes')

                        }
                    }
                    
                    else {

                        res.render('users/creargerente', { errors: errors.array(), old: req.body })
                    }
                }
            })
        return;
    },

    listadogerentes: (req, res) => {
        if (req.session.usuarioTipo == 'super') {


            db.users.findAll({
                where: { tipoUsuario: 'admin', borrar: 0}
            })
                .then((resultado) => {
                    //adminUsers = resultado
                    return res.render('users/listadogerentes', { lista: resultado })
                })
        }

    },

    editgerente: (req, res) => {
        if (req.session.usuarioTipo == 'super') {
        db.users.findByPk(req.params.id).then((userSelected) => {
            return res.render('users/editargerente', { usuario: userSelected });
        })
    }
    },


    updategerente: (req, res) => {
        db.users.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            cumpleanos: req.body.cumpleanos,
            direccion: req.body.direccion,
            contrasena: bcrypt.hashSync(req.body.contrasena, 10)
            //avatar = req.body.avatar

        }, {
            where: { id: req.params.id }
        })
        return res.redirect('/users/listadogerentes')


    },
    destroygerente: (req, res) => {
        db.users.update({
            borrar: 1, // para implementar un borrado logico

        }, {
            where: { id: req.params.id }
        })
        return res.redirect('/users/listadogerentes')
    },

    destroy: (req, res) => {
        db.users.update({
            borrar: 1, // para implementar un borrado logico

        }, {
            where: { id: req.params.id }
        })
        res.clearCookie('userEmail');
        req.session.destroy();
        res.send('Cuenta borrada exitosamente')

    },

    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        res.redirect('/');
    }
}


module.exports = controlador;

