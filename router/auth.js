const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Authenticate = require("../middleware/authenticate");


require("../db/dbConnections");
const User = require("../model/userSchema");

// simple get method 
router.get('/', (req, res) => res.send('Hello World!'));

// post method for registring the user
router.post("/registerdata", async (req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "please fill data properly"});
    }

    try {
        const userExist = await User.findOne({email: email})
            
        if(userExist){
            return res.status(422).json({ error: "email already exist" });
        }else if(password != cpassword){
            return res.status(422).json({ error: "cpassword is not maching with password" });
        }else{
            const user = new User({name, email, phone, work, password, cpassword});
            
            await user.save();
            
            res.status(201).json({ message: "user registered successfully" })
        }
        
    } catch (error) {
        console.log(error);
    }
});

// post method for user signin
router.post("/signin", async (req, res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({error: "please fill the credentials"})
        }

        const userLogin = await User.findOne({email: email});

        if (userLogin) {
            // comparing password with database password
            const isMatch = await bcrypt.compare(password, userLogin.password);

            //here we are generating token 
            const token = await userLogin.generateAuthToken();
            console.log(token);

            // generating cookie
            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            if(!isMatch){
                res.status(400).json({error: "invalid creadiantiles"})
            }else{
                res.json({message: "User signin successfully"})
            }
            
        } else {
            res.status(400).json({error: "this email is not registered"})            
        }

    } catch (error) {
        console.log(error)
    }
})

// about us
router.get('/about', Authenticate, (req, res) => {
    res.send(req.rootUser);
});

// get user data for homepage and contact
router.get('/getData', Authenticate, (req, res) => {
    res.send(req.rootUser);
});

// contact us api 
router.post('/contact', Authenticate, async (req, res) => {
    try {
        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message){
            return res.json({error: "form fields are empty"})
        }

        const userContact = await User.findOne({ _id: req.userId });

        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save()

            res.status(201).json({message: "user contact successfull"});
        }
        
    } catch (error) {
        console.log(error)
    }
});

// api for logout page that will remove the cookie
router.get("/logout", (req, res) => {
    res.clearCookie("jwttoken");
    res.status(200).send("user logout");
})


module.exports = router;