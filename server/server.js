import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

// aleatoire valeur
import { nanoid } from "nanoid"

// Model

import User from "./Schema/User.js"

dotenv.config()

const server = express()
const PORT = 3000

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;    // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;      // regex for password

// On accepte les informations devant de body
server.use(express.json())

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
})

// Generate Username

const generateUsername = async ( email ) => {

    let username = email.split("@")[0]
    let isUsernameNotUnique = await User.exists({
        "personal_info.username": username
    })
    .then((result) => result)

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : ""

    return username

}

// End-Point Sign Up
server.post("/signup", (req, res) => {
    
    let { fullname, email, password } = req.body

    // Validation
    if(fullname.length < 3){
        return res.status(403).json({"error": "Fullname must be at least 3 letters longs"})
    }

    if(!email.length){
        return res.status(403).json({"error": "Enter Email"})
    }

    if(!emailRegex.test(email)){
        return res.status(403).json({"error": "Email is invalid"})
    }

    if(!passwordRegex.test(password)){
        return res.status(403).json({"error": "Le mot de passe doit contenir entre 6 et 20 caractères, avec au moins une majuscule, une minuscule et un chiffre."})
    }

    bcrypt.hash(password, 10, async (err, hased_password) => {
        
        let username = await generateUsername(email)

        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hased_password,
                username
            }
        })

        user.save()
            .then((u) => {
            return res.status(200).json({ 
                user: u 
            })
        })
        .catch(err => {

            if(err.code === 11000){
                return res.status(500).json({ 
                    "error": "Email already exists"
                })
            }

            return res.status(500).json({ 
                "error": err.message 
            })
        })
    })

});



server.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})