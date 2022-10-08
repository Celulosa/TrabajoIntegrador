const port = process.env.PORT || 3010
const mainRouter = require('./src/routes/mainRouter')
const productsRouter = require('./src/routes/productsRouter')
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.listen( port ,() =>{
    console.log(`Servidor en puerto ${port} OK`);
});

// configuracion motor de plantillas
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// sistema de rutas
app.use('/', mainRouter);
app.use('/products', productsRouter);

app.use('*', function(req,res) {     res.send("Ruta equivocada") });