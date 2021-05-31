//Carregando módulos 
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/postagens")
const Postagem = mongoose.model("postagens")

//Configurações
    //Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //Boddy Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true}
    }))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log("Conectado ao mongo")
    }).catch((err)=>{
        console.log("Erro ao se conectar: "+err)
    })

    //Public
        app.use(express.static(path.join(__dirname,"public")))

        
//Rotas
    app.get('/', (req, res) =>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render("index", {postagens: postagens})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
        
    })
    app.get("/404", (req, res) =>{
        res.send("Erro 404!")
    })
    app.get("/postagem/:slug", (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render("postagem/index", {postagem})
            }else{
                req.flash("error_msg", "Essa postagem não existe")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um err interno")
            res.redirect("/")
        })
    })
    app.get('/post', (req, res) =>{
        res.send("Lista de posts")
    })

    app.use('/admin', admin)
//Outros

const PORT = 8083
app.listen(PORT, () => {
    console.log("Servidor Rodando! ")
})
