const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//set handlebars as view engine and the paths for views and partials
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//set static content directory into use
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Watcher',
        author: 'Roberto Milani'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'What is this..?',
        author: 'Roberto Milani'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Get some Help',
        author: 'Roberto Milani',
        helpMessage: 'this is a placeholder help message'
    })
});

app.get('/weather', (req, res) => {

    const address = req.query.address;

    //if no address provided in query, return error
    if (!address) {
        return res.send({
            error: 'Please provide an address.'
        });
    }

    //call geocode to get coordinates, then use those to get forecast
    geocode(address,
        (error, { longitude, latitude, location }) => {

            if (error) {
                return res.send({ error });
            }

            forecast(longitude, latitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error });
                }

                res.send({
                    address,
                    location,
                    forecastData
                });

            })

        })

});



app.get('/help/*', (req, res) => {
    res.render('errorPage', {
        title: '404 Error',
        author: 'Roberto Milani',
        errorMessage: 'Could not find this Help article.'
    })
});

app.get('*', (req, res) => {
    res.render('errorPage', {
        title: '404 Error',
        author: 'Roberto Milani',
        errorMessage: 'Page not found.'
    })
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});