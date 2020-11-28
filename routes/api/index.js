const router = require('express').Router();

// index page
router.get('/', (req, res, next) => {
    res.setHeader('Content-type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'no-sniff');
    res.render('index');
});

// contactus page
router.get('/contact', (req, res, next) => {
    res.setHeader('Content-type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'no-sniff');
    res.render('contact');
});

// about page
router.get('/about', (req, res, next) => {
    var people = [
        { id: 1, name: "Pablo", lastName:"Damm", job:"Director de Proyecto",    description: "" },
        { id: 2, name: "Matias", lastName: "Bueno", job:"Analista Funcional",   description: "" },
        { id: 3, name: "Lourdes", lastName: "Urban", job:"Analista Funcional",  description: "" },
        { id: 4, name: "Gabriel", lastName: "Campos", job:"Tester",             description: ""},
        { id: 5, name: "Yamil" , lastName: "Arellano", job:"Analista Tecnico",  description: ""},
        { id: 6, name: "Yanina" , lastName: "Fiordoliva", job:"Documentadora",  description: ""},
        { id: 7, name: "Pedro", lastName: "Bonanatta", job:"Tester",            description: ""},
        { id: 8, name: "Miguel" , lastName: "Garcia", job:"Desarrollador",      description: ""},
    ]
    res.setHeader('Content-type', 'text/html');
    res.render('about', { people });
});

// Videos Ayuda
router.get('/ayuda', (req, res, next) => {
    var videos = [
        { id: 1, name: "Certificados", url:"https://www.youtube.com/embed/aVi6mDmZa78"},
        { id: 2, name: "Direccion", url:"https://www.youtube.com/embed/vna_7P2aslI"},
        { id: 3, name: "Carreras", url:"https://www.youtube.com/embed/AugFoFOJ7MQ"},
        { id: 4, name: "Horarios", url:"https://www.youtube.com/embed/x8L_D5wQGx0"},
        { id: 5, name: "Mesa de Examen", url:"https://www.youtube.com/embed/PJ2k_LqAKgI"},
        { id: 6, name: "Plan de Estudio", url:"https://www.youtube.com/embed/GWxsw7-_xnQ"},
        { id: 7, name: "Sede", url:"https://www.youtube.com/embed/vna_7P2aslI"},
    ]
    res.setHeader('Content-type', 'text/html');
    res.render('ayuda', { videos });
})

module.exports = router;