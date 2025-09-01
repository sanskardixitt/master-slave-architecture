const express = require('express');
const {connectToDatabase, getDb} = require('./databaseConnection');
const { ReadPreference } = require ("mongodb");

const app = express();

app.use(express.json());

connectToDatabase().then(()=>{
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });
}).catch((error)=>{
    console.error('Error connecting to the database', error);
});


// Endpoint for STRONG CONSISTENCY
// Write is confirmed by a majority, and Read comes from the PRIMARY.

app.post('/strong',async (req,res)=>{

 try {
    
    const data = {
        key : req.body.key,
        value:req.body.value,
        timestamp:Date.now(),
    };

    const collection = await getDb().collection('strongData');

    const result = await collection.insertOne(data,{w : 'majority'});
    console.log(`Strong write successful for key: ${req.body.key}`);

    return res.status(201).json({message: `Strong write successful for key: ${req.body.key}`});
 




 } catch (error) {
    console.error('Error writing to the database', error);
    return res.status(500).json({message: 'Error writing to the database'});
 }

});

app.get('/strong/:key',async(req,res)=>{
    try {
        const collection = await getDb().collection('strongData');
        const data = await collection.findOne({key:req.params.key},{readPreference:'primary'});
        if(data){
            return res.status(200).json({message: 'Data found', data});
        }
        else{
            return res.status(404).json({message: 'Data not found'});
        }
    } catch (error) {
        console.error('Error reading from the database', error);
        return res.status(500).json({message: 'Error reading from the database'});
    }
});

// Endpoint for EVENTUAL CONSISTENCY
app.post('/eventual',async(req,res)=>{

    try {

        const data = {
            key : req.body.key,
            value:req.body.value,
            timestamp:Date.now(),
        };

        const collection = await getDb().collection('eventualData');

        const result = await collection.insertOne(data,{w : 'majority'});
        console.log(`Eventual write successful for key: ${req.body.key}`);
        return res.status(201).json({message: `Eventual write successful for key: ${req.body.key}`});

    } catch (error) {
        console.error('Error writing to the database', error);
        return res.status(500).json({message: 'Error writing to the database'});
    }
});

app.get('/eventual/:key', async (req, res) => {
    try {
        const collection = await getDb().collection('eventualData');

       
        const data = await collection.findOne(
            { key: req.params.key },
            { readPreference: ReadPreference.SECONDARY_PREFERRED }
        );

        if (data) {
            console.log(`Eventual read successful for key: ${req.params.key}`);
            return res.status(200).json(data);
        } else {
            return res.status(404).json({ message: 'Document not found' });
        }

    } catch (error) {
        console.error('Error during eventual read', error);
        return res.status(500).json({ message: 'Error during eventual read', error: error.message });
    }
});

