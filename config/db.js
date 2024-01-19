
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restaurant2')
    .then(() => { console.log('conection succesful') })
    .catch((err) => { console.log(err) });