const mongoose = require('mongoose');

const dbConfig = 'mongodb+srv://fabianoxavante:212799**fX@cluster0.uvviffl.mongodb.net/anotations?retryWrites=true&w=majority';

const connection = mongoose.connect(dbConfig, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

module.exports = connection;