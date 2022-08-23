const express = require(`express`)
require(`dotenv`).config() //Trae el PORT desde .env
const path = require(`path`)
const hbs = require (`hbs`)
const mysql = require(`mysql2`)
const nodemailer = require(`nodemailer`)
const { isGeneratorFunction } = require("util/types")
//Se llevan cabo todo lo instalado en npm install

const app = express()
const PORT = process.env.PORT || 8080 //Si le PORT de .env esta ocupado; usa el 8080

/* HEROKU
// Conexion de la DataBase
const conexion = mysql.createConnection({
    host: process.env.HOST, //localhost
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

conexion.connect((err) => {
    if (err) {
        console.error(`Error en la conexion ${err.stack}`)
        return;
    }
        console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
    }
) 
HEROKU */

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, `public`)))


app.set (`view engine`, `hbs`)
app.set(`views`, path.join(__dirname, `views`))
hbs.registerPartials(path.join(__dirname, `views/partials`))


app.get(`/`, (req,res, next) => {
    res.render(`index`,{
        titulo: `Argentina Vuela 2022`
    })
})

app.get(`/formulario`, (req, res, next) => {
    res.render(`formulario`, {
        titulo: `Formulario de Datos Personales`,
        style: `estilos.css`,
    })
})
/* HEROKU
app.get(`/usuarios`, (req, res, next) => {
    let sql = 'SELECT * FROM usuarios'

        conexion.query(sql, (err, result) => {
            if(err) throw err;
            res.render(`usuarios`, {
                titulo: `Lista de Usuarios`,
                result: result
            })
        })
})
HEROKU */
app.get(`/usuarios`, (req, res, next) => {
    
    res.render(`usuarios`, {
        titulo: `Lista de Usuarios`,       
    })
        
})

app.get(`/contacto`, (req,res) => {
    res.render(`contacto`, {
        titulo: `Formulario para contacto`
    })
})

app.post(`/contacto`, (req,res) => {
    const {nombre, apellido, email} = req.body
    let fecha = new Date()

    if (nombre == '' || apellido == '' || email == '') {
        let validacion = `Complete todos los datos`
        res.render(`contacto`, {
            titulo: `Formulario para Contacto`,
            validacion
        }) 
    }else{
        /* HEROKU
        console.log(nombre);
        console.log(apellido);
        console.log(email);
        HEROKU */
        let usuarios = {
            nombre: nombre,
            apellido: apellido,
            email: email
        }

        async function envioEmail(){
            
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USEREMAIL,
                    pass: process.env.PASSWORDEMAIL
                }
            })

            let envio = await transporter.sendMail({
                from: process.env.USEREMAIL,
                to: `${email}`,
                subject: `Argentina Vuela 2022`,
                html: `Informacion extra sobre el evento <br> ${fecha}`
            })

            
            res.render('enviado', {
                titulo: 'Email enviado',
                nombre,
                apellido,
                email
            })
        }

    envioEmail()

    }
})

app.post(`/formulario`, (req, res) => {
    const {nombre, apellido, dni} = req.body;
    //HEROKU console.log(`Nombre: ${nombre}, Apellido: ${apellido}, DNI: ${dni}`);

    if (nombre == '' || apellido == '') {
        let validacion = `Complete todos los datos`
        res.render(`formulario`, {
            titulo: `Formulario de Datos Personales`,
            validacion
        }) 
    }else{

        let usuarios = {
            nombre: nombre,
            apellido: apellido,
            dni: dni
        }

        let sql = 'INSERT INTO USUARIOS SET ?'

        conexion.query(sql, usuarios, (err, result) => {
            if(err) throw err;
            res.render('formCompleto', {
                titulo: 'Formulario completado',
                nombre,
                apellido,
                dni
            })
        })
    }
})


app.listen(PORT, () => {
    //HEROKU console.log(`El servidor esta trabajando en el Puerto ${PORT}`);
})