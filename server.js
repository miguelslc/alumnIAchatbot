const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config({silent: true});

app.use(express.json());

const viewsPath = path.join(__dirname, './views');
app.use(express.static(path.join(__dirname, 'views')));
// set the view engine to ejs

app.set('view engine', 'ejs');
app.set('views', viewsPath);

// use res.render to load up an ejs view file

//Importar Rutas
const watsonRoutes = require('./routes/api/watson');
const indexRoutes = require('./routes/api/index');

app.use("/api/watson", watsonRoutes);
app.use("/", indexRoutes);
//Start Server
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});