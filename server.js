const express = require('express');
const fs = require('fs');
const path = require('path');
// non-module variables
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;

const app = express();


// --- MIDDLEWARE ---
// ===================================
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
// serve static files
app.use(express.static('public'))
// ===================================


function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
    // setting filteredResults equal to animalsArray
    let filteredResults = animalsArray;

    // handle queries for personality traits
    if(query.personalityTraits) {
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        } else{
            personalityTraitsArray = query.personalityTraits;
        }
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){
    const animal = body;
    // add animal to array
    animalsArray.push(animal);
    // write updated array to json file
    fs.writeFileSync(
        path.join(__dirname, './data/aniamls.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}

function validateAnimal(animal){
    // check if it has a name and the name is a string
    if(!animal.name || typeof animal.name !== 'string'){
        return false
    }
    // check if it has a species and the species is a string
    if(!animal.species || typeof animal.species !== 'string'){
        return false
    }
    // check if it has personalityTraits and that they are an array
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false
    }
    // if animal passes all the above conditions, return true
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else res.sendStatus(404)
})

app.post('/api/animals', (req, res)=>{
    // req.body is where our incoming content will be
    console.log(req.body);
    
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // validate animal sent. if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.')
    } else{ 
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// serves index.html file to client
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
})