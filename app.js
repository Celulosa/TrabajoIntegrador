const port = process.env.PORT || 3010
const mainRouter = require('./src/routes/mainRouter')
const productsRouter = require('./src/routes/productsRouter')

const usersRouter = require('./src/routes/usersRouter')

const express = require('express');
const path = require('path');
const methodOverride = require('method-override') // para poder usar PUT y DELETE
const app = express();

app.use(express.static('public'));
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
// sistema de rutas
app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

app.use('*', function(req,res) {     res.send("Ruta equivocada") });