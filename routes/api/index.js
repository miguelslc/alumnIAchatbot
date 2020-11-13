const router = require('express').Router();

// index page
router.get('/', (req, res, next) => {
    res.setHeader('Content-type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'no-sniff');
    res.render('index');
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

module.exports = router;