const port = process.env.PORT || 3040
const mainRouter = require('./src/routes/mainRouter')
const productsRouter = require('./src/routes/productsRouter')
const apiRouter = require('./src/routes/apiRouter')
const usersRouter = require('./src/routes/usersRouter')

const express = require('express');
const path = require('path');
const methodOverride = require('method-override') // para poder usar PUT y DELETE
const app = express();
const cors  = require('cors');//para poder entregarle al dash board la data de los endpoints que está en el APIcontroller
const session = require('express-session')// para mantener la session
const cookies = require('cookie-parser')// para usar cookies
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware')// Cookie para que el usuario permanezca logeado aun cuando cierre el navegador




app.use(express.static('public'));// para los archivos publicos
app.use(cors());

app.listen( port ,() =>{
    console.log(`Servidor en puerto ${port} OK`);
});

// configuracion motor de plantillas
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//Configuracion para poder capturar datos con POST y JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//configuracion para poder usar PUT y DELETE.  Primero hay que instalar method override usando npm install method-override --save
app.use(methodOverride('_method'));
// Para mantener la session
app.use(session({
    secret: 'codigo secreto',
    resave: false,
    saveUninitialized: false,
}));

// Para usar cookies
app.use(cookies());
//Middleware para verificar si un usuario esta logeado y esconder a dejar ver algunas partes del header
app.use(userLoggedMiddleware);


// sistema de rutas
app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);


app.use('*', function(req,res) {     res.send("Ruta equivocada") });