const mongoose = require('mongoose');

const db = "mongodb+srv://Test:321ewq@cluster0.qxm4b.mongodb.net/SearchHistory?retryWrites=true&w=majority";

mongoose
.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database");
})
.catch(()=> {
    console.log("Error connecting to database");
})

const historySchema = new mongoose.Schema({
    title: {type: String}
});

const searches = mongoose.model('searches', historySchema);

module.exports = searches;