const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const path = require("path");

const app = next({ dev })
const port = parseInt(process.env.PORT, 10) || 3000

const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()


    // verifica canale da bar
    server.get('/google78b70bd68a396ac5.html', (req, res) => {
        res.download(
            path.join(__dirname, "./public/files/google78b70bd68a396ac5.html")
        );
    })

    server.get('*', (req, res) => handle(req, res))

    server.post('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})


