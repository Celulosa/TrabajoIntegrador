const controlador ={
    login: (req , res) => {
        res.render('users/login');
    },

    registro: (req , res) => {
        res.render('users/registro');
    },
}   

module.exports = controlador;