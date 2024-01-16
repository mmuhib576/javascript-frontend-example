const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db');
const cors = require('cors');
const app = express();
const session = require('express-session');
const PORT = 9000;
const {v1:uuidv1} = require('uuid');
app.use(bodyParser.json());
db.init();
app.use(cors());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

const redirectLoggedIn = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('http://localhost:3000/Home');
  }
  next();
}



app.post('/login',async (req, res) => {
    const { email, password } = req.body;
    
    const user = await db.findOne('Assignment-3',{ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.session.user_id = user.user_id;
    req.session.email = user.email;
    req.session.user_name = user.user_name;
    res.status(201).json({user_id : user.user_id ,email: user.email,user_name : user.user_name});
  });

// Sign up code 



app.post('/signup',redirectLoggedIn,async(req,res)=> {
  const {email, password,name} = req.body
  const uuid = uuidv1()
  const Hpassword = await bcrypt.hash(password,10)
  try{
      
      const isexist = await db.findOne('Assignment-3',{ email: email });
      if(isexist){
          return res.status(409).send('Already registered')
      }
      else{
          const LcaseEmail = email.toLowerCase()
          const data = {
              user_id : uuid,
              email : LcaseEmail,
              hashed_password : Hpassword,
              user_name: name

          }
          
          const DataInserted = await db.insertOne('Assignment-3',{ data});
          res.status(201).json({userid : uuid ,email: LcaseEmail})

      }
  }catch(error){
      console.log(error)
  }finally{
      await db.client.close()
  }
})

app.delete('/delete/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const filter = { user_id: user_id };
    const result = await db.deleteOne('Assignment-3', filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Signup code ends

//Update Code
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', },
}));

app.put('/update', async (req, res) => {
  const { name, email, password , user_id} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
   // Get the user ID from the session
  

  try {

    const updateQuery = { user_id: user_id };
    const updateDoc = {
      $set: { user_name : name, email : email, password: hashedPassword }
    };
    const result = await db.updateOne('Assignment-3',updateQuery, updateDoc);

    if (result.modifiedCount === 1) {
      res.send({ success: true });
    } else {
      res.status(400).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  } finally {
    await client.close();
  }
});




//Update Code ends

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});