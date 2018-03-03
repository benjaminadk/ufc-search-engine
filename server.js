import express from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import mma from 'mma'
import geocoder from 'google-geocoder'

const server = express()
const PORT = 8081
const geo = geocoder({ key: '[insert api key here]' })

server.use(bodyParser.json())

server.get('/api/fighters', (req, res) => {
    fetch('http://ufc-data-api.ufc.com/api/v1/us/fighters')
        .then(data => data.json())
        .then(json => res.send(json))
        .catch(error => console.log(error))
})

server.post('/api/fighter', (req, res) => {
    mma.fighter(req.body.name, function(data) {
        if(data.location.length > 0) {
            geo.find(data.location, function(err, result) {
                if(err) console.log(err)
                data.coordinates = result[0].location
                res.send(data)
            })
        } else {
            res.send(data)   
        }
    })
})

server.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`))