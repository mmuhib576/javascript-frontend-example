const { MongoClient, ObjectId } = require('mongodb')
const uri = 'mongodb+srv://People-Love:xU6yUbTmYsJnTWB7@cluster0.gjcbjqc.mongodb.net/Cluster0?retryWrites=true&w=majority'

let client;
let database;
//const collectionName = "Assignment-3"
module.exports.init = async function(){
    client = new MongoClient(uri)
    try{
        await client.connect()
        database = client.db('app-data') 
        const users = database.collection('Assignment-3')
        console.log("Connected");
    }catch(error){
        console.log(error)
    }
}


module.exports.insertOne = async function(collectionName, data) {
    const { user_id, email, hashed_password, user_name } = data.data;
    return  await database.collection(collectionName).insertOne({user_id,email,hashed_password,user_name,});
} 

module.exports.updateOne = async function(collectionName, filter, data) {
    return await database.collection(collectionName).updateOne(filter, data);
} 

module.exports.deleteOne = async function(collectionName, filter) {
    return await database.collection(collectionName).deleteOne(filter);
} 

module.exports.findOne = async function(collectionName, filter) {
    return await database.collection(collectionName).findOne(filter);
  }

module.exports.find = async function(collectionName) {
    return await database.collection(collectionName).find().toArray();
}