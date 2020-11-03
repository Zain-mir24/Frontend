const path = require('path')
const express = require('express');
const hbs = require('hbs');
const app = express();

const geocode = require('./utils/geocode');
const forecast = require('./utils/temp');
const port =process.env.PORT || 3000;

//Define paths for express config
const publicdirectorypath = path.join(__dirname, '../public');
const viewspath = path.join(__dirname, '../template/views');
const partialspath = path.join(__dirname, '../template/partials')
//Setup handlebars engine and views location   
app.set('view engine', 'hbs')
app.set('views', viewspath)
hbs.registerPartials(partialspath)
//setup static directory  to serve
app.use(express.static(publicdirectorypath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'weather-app',
        name: 'andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about me',
        name: 'zain mir'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is a help page',
        title: 'Help page',
        name: 'zain mir'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search item'
        })

    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Provide an address'
        })
    }
      
      geocode(req.query.address, (error, {latitude,longitude,location}={}) => {
      
      if(error){
         return res.send({error});
      }
      
        forecast(req.query.address,latitude,longitude,(error,forecastdata)=>{
      
         if(error){
           return res.send({error});
         } 

  res.send({
      
    
     forecast:forecastdata,
     address:req.query.address,
      
  })
        })

    })


  //  res.send({
  //      forecast: 'Sunny day',
 //       location: 'pakistan',
 //       address: req.query.address
 //   })
//

})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'zain mir',
        errormessage: 'help article not found'
    })

})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'zain mir',
        errormessage: 'page not found'
    })


})
app.listen(port, () => {
    console.log('Server is up on port'+3000)
})  