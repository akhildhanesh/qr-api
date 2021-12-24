const QR = require('qrcode')
const express = require('express')
const { rm } = require('fs/promises')
const app = express()
require('dotenv').config()
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 8080

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/qr', (req, res) => {
    res.render('qr.hbs')
})

app.post('/data', (req, res) => {
    let data = req.body.text

    const colors = ['#301934', '#023020', '#36454F', '#000000', '#343434', '#191970']

    const fName = Date.now()
    QR.toFile(`./public/qr/${fName}.png`, data, {
        color: {
            dark: colors[Math.floor(Math.random() * colors.length)],
            light: '#0000'
        },
        scale: 10,
        margin: 5,
        errorCorrectionLevel: 'H'
    })
        .then(() => {
            res.json({ qr: `http://192.168.0.105:${PORT}/qr/${fName}.png` })
            setTimeout(() => {
                rm(`./public/qr/${fName}.png`)
            }, 5000)
        })
        .catch(e => {
            res.status(500).json({error: `${e}`})
            console.log(e)
        })
})

app.get('*', (req, res) => {
    res.status(404).json({error: 'Not Found'})
})


app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))


