const express = require("express");
const { response } = require("express");
const app = express();
const axios = require("axios");
const mongoose = require('mongoose');
const searches = require('./database');

app.get("/search", (req, res) => {

    var food = "Pizza";
    if (req.query.title) {
        food = req.query.title;

    } else if(req.query.find){
        food = req.query.find;

        searches.find({}).exec(function (err, data) {
            if (err) {
                console.log(err);
                console.log('error returned');
            }

            if (data.length >= 5){
                searches.deleteOne({title: data[0].title}, function(err) {
                    if (err) { 
                        console.log('Error: ' + err);
                    }
                });
            }
        });
    }
    
    const apikey1 = "16888ed725af4c76bfad2197c7ac275c";
    var querystr = `https://api.spoonacular.com/recipes/guessNutrition?apiKey=${apikey1}&title=${food}`;
    var querystr1 = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey1}&query=${food}`;

    if (req.query.find) {

        axios.get(querystr1).then((response) => {    
            let ress = {
                status : true,
                data : response.data.results
            }

            let save = new searches ({
                title: food
            });

            save.save().then(result =>{
                // console.log("Success: " + result);
            })
            .catch(error => {
                // console.log("Error: " + error);
            });
            
            res.send(JSON.stringify(ress));
        });

    } else if(req.query.title){

        axios.get(querystr).then((response) => {

          var data2;
          data2 = response;

          axios.get(querystr1).then((response) => {    

            if(data2.data.status){
                let ret = {
                    status: false,
                    message: "Not enough data for an informed guess."
                };
                res.send(JSON.stringify(ret));
                return 0;
            }

              let datas = {
                status : true,
                calories:  (data2.data.calories.value) ?  data2.data.calories.value : '',
                fat:       (data2.data.fat.value) ?  data2.data.fat.value : '',
                protein:   (data2.data.protein.value) ?  data2.data.protein.value : '',
                carbs:     (data2.data.carbs.value) ?  data2.data.carbs.value : '',
                unit:      (data2.data.fat.unit) ?  data2.data.fat.unit : '',
                title :    (response.data.results[0].title) ?  response.data.results[0].title : '',
                image :    (response.data.results[0].image) ?  response.data.results[0].image : '',
              };

              res.send(JSON.stringify(datas));

          });

        });

    }

});

app.get("/recent-searches", (req, res) => {
    searches.find({}).select('title -_id').exec(function (err, data) {
        if (err) {
            console.log(err);
            console.log('error returned');
        }

        res.send(JSON.stringify(data));
    });
});

app.get("/", (req, res) => {
    res.send('Welcome to foody api');
});


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
