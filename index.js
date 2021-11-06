const express = require("express");
const { response } = require("express");
const app = express();
const axios = require("axios");


app.get("/", (req, res) => {
    console.log(req.query);
    var food = "Pizza";
    if (req.query.title) {
        food = req.query.title;

    } else if(req.query.find){
        food = req.query.find;
    }
    const apikey1 = "409a26064cda441f8e32ba9609142986";
    var querystr = `https://api.spoonacular.com/recipes/guessNutrition?apiKey=${apikey1}&title=${food}`;
    var querystr1 = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey1}&query=${food}`;

    if (req.query.find) {

        axios.get(querystr1).then((response) => {    
            let ress = {
                status : true,
                data : response.data.results
            }
            res.send(JSON.stringify(ress));
        });

    } else if(req.query.title){

        axios.get(querystr).then((response) => {

            if(!response.data.status){

                let ret = {
                    status: false,
                    message: "Not enough data for an informed guess."
                };

                res.send(JSON.stringify(ret));
                return 0;
            }
          var data2;
          data2 = response;

          axios.get(querystr1).then((response) => {    

            if(!response.data.status){

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

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
