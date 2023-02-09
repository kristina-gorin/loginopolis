const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt')

const SALT_COUNT = 10;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register',async (req,res,next)=>{
  try{
    const {username,password} = req.body;
    const hash = await bcrypt.hash(password,SALT_COUNT)

  await User.create({
    username,
    password:hash
  })
  const [foundUser] = await User.findAll({where:{username}})
  // console.log(foundUser.password)
  // console.log("hashed password: ",hash)
  res.send("successfully created user "+username)
  
}
  catch (error) {
    next(error)
  }})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req,res,next)=>{
  try{
    const {username,password} = req.body;
    const found = await User.findAll({where:{username}})
    const user = found[0].username
    console.log(found)
    const match = await bcrypt.compare(password,found[0].password)
    console.log(match)
    if(match){
      res.send("successfully logged in user "+ username)
      console.log(found.password)
    }
    res.send("incorrect username or password")
}
  catch (error){
  next(error)
}
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
