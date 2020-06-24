const path = require('path')
const router = require('express').Router();

// serves index.html file to client
router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public/index.thml'))
})

// serves animals.html file to client
router.get('/animals', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public/animals.html'))
})

// serves zookeeprs.html file to client
router.get('/zookeepers', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'))
})

module.exports = router;