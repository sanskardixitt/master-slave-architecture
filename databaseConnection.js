const {MongoClient} = require('mongodb'); //importing the mongoClient from the mongodb library

const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=myReplicaSet'; //uri of the database

const client = new MongoClient(uri); //creating a new mongoClient
let db; //database object

async function connectToDatabase(){ //function to connect to the database

    try{
        await client.connect(); //connecting to the database
        db = client.db('replicationTest'); //setting the database object
        console.log("successfully connected to the mongodb replica set");

    }
    catch(error){
        console.error('Error connecting to the database', error); 
    }}

    function getDb(){

        if(!db) //if the database object is not set
        {
            throw new Error('Database not connected');
        }
        return db; //returning the database object
    }






module.exports = {connectToDatabase, getDb};    //exporting the functions