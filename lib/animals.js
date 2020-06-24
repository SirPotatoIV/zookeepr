const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/aniamls.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};
