const router = require('express').Router();

// index page
router.get('/', (req, res, next) => {
    res.setHeader('Content-type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'no-sniff');

    var people = [
        { id: 1, name: "Pablo",   lastName: "Damm",       job:"Director de Proyecto",   img:"https://fotos.subefotos.com/43a6d6441a32f67d336e8bf797a31a34o.jpg"},
        { id: 2, name: "Matias",  lastName: "Bueno",      job:"Analista Funcional",     img:"https://fotos.subefotos.com/5ca8300094b7cf7fc7eb946c9448a113o.png"},
        { id: 3, name: "Lourdes", lastName: "Urban",      job:"Analista Funcional",     img:"https://fotos.subefotos.com/660caee4500153c8823af6dc20ed14f2o.png"},
        { id: 4, name: "Yamil" ,  lastName: "Arellano",   job:"Analista Tecnico",       img:"https://fotos.subefotos.com/60786c446db579e71f131d2dcc8cc471o.png"},
        { id: 5, name: "Yanina" , lastName: "Fiordoliva", job:"Técnica en RRHH",        img:"https://fotos.subefotos.com/0ad92412b891585e39bd8a75ed1afcdao.png"},
        { id: 6, name: "Gabriel", lastName: "Campos",     job:"Tester",                 img:"https://fotos.subefotos.com/5246b08c7db12e4d47c3605a36a77923o.png"},
        { id: 7, name: "Pedro",   lastName: "Bonanatta",  job:"Tester",                 img:"https://fotos.subefotos.com/95f57075d59be692c95b9d810092492bo.png"},
        { id: 8, name: "Miguel" , lastName: "Garcia",     job:"Desarrollador",          img:"https://fotos.subefotos.com/697d98123dc0d664dd75ec26aa630527o.png"},
    ]

    var videos = [
        { id: 1, name: "Certificados",      url:"https://www.youtube.com/embed/aVi6mDmZa78"},
        { id: 2, name: "Dirección",         url:"https://www.youtube.com/embed/vna_7P2aslI"},
        { id: 3, name: "Carreras",          url:"https://www.youtube.com/embed/AugFoFOJ7MQ"},
        { id: 4, name: "Horarios",          url:"https://www.youtube.com/embed/x8L_D5wQGx0"},
        { id: 5, name: "Mesa de Examen",    url:"https://www.youtube.com/embed/PJ2k_LqAKgI"},
        { id: 6, name: "Plan de Estudio",   url:"https://www.youtube.com/embed/GWxsw7-_xnQ"},
        { id: 7, name: "Sede",              url:"https://www.youtube.com/embed/vna_7P2aslI"},
    ]
    
    res.render('index', { videos, people });
});

module.exports = router;