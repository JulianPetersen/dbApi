import mongoose from "mongoose";

    mongoose.connect('mongodb://localhost/deliverbrandsen')
        .then(db => console.log('DB is connected'))
        .catch(error => console.log(error))