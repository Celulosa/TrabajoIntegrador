const mainRouter = require('./src/routes/mainRouter')
const productsRouter = require('./src/routes/productsRouter')
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.listen(process.env.PORT || 3010,() =>{
    console.log('Servidor en puerto 3010 OK');
});

app.set('view engine', 'ejs');

app.use('/', mainRouter);
app.use('/products', productsRouter);

/*
app.get('/detalleproducto', (req,res)=>{
res.sendFile(path.join(__dirname, './views/detalleproducto.html'));
});

app.get('/carrito', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/carrito.html'));
    });

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/login.html'));
    });

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/home.html'));
    });
app.get('/registro', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/registro.html'));
    });*/
