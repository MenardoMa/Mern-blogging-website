import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors"

import upload from './middleware/upload.js';
import cloudinary from "./config/cloudinary.js"

// aleatoire valeur
import { nanoid } from "nanoid"

// Model
import User from "./Schema/User.js"
import blogs from "./Schema/Blog.js"

// Middleware
import { verifyJWT } from "./middleware/verifyJWT.js";

dotenv.config()

const server = express()
const PORT = 3000

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;    // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;      // regex for password

// On accepte les informations devant de body
server.use(express.json())

// cors
server.use(cors({
    origin: "http://localhost:5173"
}))

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
})

// Data Format for user
const formatDatatoSend = (user) => {
    
    const access_token = jwt.sign(
        { id: user._id }, 
        process.env.SECRET_ACCESS_KEY,
    )
    
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

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

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        
        let username = await generateUsername(email)

        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username
            }
        })

        user.save()
            .then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err => {

            if(err.code === 11000){
                return res.status(500).json({ 
                    "error": "Email already exists"
                })
            }

            return res.status(500).json({ 
                "error": err 
            })
        })
    })

});

// End-Point Sign In
server.post("/signin", (req, res) => {

    let { email, password } = req.body

    User.findOne({ "personal_info.email": email })
    .then((user) => {
        
        if(!user){
            return res.status(403).json({ "error": "Email introuvable" })
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {

            if(err){
                return res.status(403).json({ 
                    "error": "Une erreur s'est produite lors de la connexion. Veuillez réessayer." 
                })
            }

            if(!result){
                return res.status(403).json({ "error": "Mot de passe incorrect" })
            }else{
                return res.status(200).json(formatDatatoSend(user))
            }


        })

    })
    .catch(err => {
        console.log(err)
        return res.status(403).json({ 
            "error": "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
        })
    })

})


// End-Point Upload Image
server.post("/upload", upload.single("image"), async (req, res) => {

    // Folder Accept
    const allowedFolders = {
        avatar: "blog-app/avatars",
        banner: "blog-app/banners",
        content: "blog-app/blog-content"
    }

    // Transformation
    const transformations = {
        avatar: {
            width: 256,
            height: 256,
            crop: "limit",
        },

        banner: {
            width: 1600,
            height: 1000,
            crop: "fill",
            gravity: "auto"
        },

        content: {
            width: 1200,
            crop: "limit"
        }
    }

    try {

        // Vérifier qu'une image a été envoyée
        if (!req.file) {
            return res.status(400).json({
                error: "Aucune image envoyée"
            })
        }

        // Vérifier le type de dossier
        const folder = allowedFolders[req.body.folder]
        // Vérifier le type de crop par rapport au folder
        const transformation = transformations[req.body.folder]

        if (!folder) {
            return res.status(400).json({
                error: "Type d'image invalide"
            })
        }

        // Upload vers Cloudinary
        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image",
                    transformation
                },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )

            stream.end(req.file.buffer)
        })

        return res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id
        })

    } catch (error) {
        return res.status(500).json({
            error: "Erreur lors de l'upload de l'image"
        })
    }
})


/** 
 * 
 * End-point Create-Blog 
 * 
 */
server.post("/create-blog", verifyJWT, (req, res) => {
    
    let authorId = req.user 

    let { title, des, banner, tags, content, draft } = req.body

    if (!title?.length) {
        return res.status(403).json({ error: "Le titre de l'article est obligatoire" })
    }

    if (!des?.length || des?.length > 200) {
        return res.status(403).json({ error: "La description de l'article est obligatoire et doit contenir moins de 200 caractères" })
    }

    if (!banner?.length) {
        return res.status(403).json({ error: "La bannière de l'article est obligatoire" })
    }

    if (!content?.blocks?.length) {
        return res.status(400).json({ error: "Le contenu de l'article est obligatoire" })
    }

    if (!tags?.length || tags?.length > 10) {
        return res.status(400).json({  error: "Veuillez ajouter au moins un tag à votre article. Vous pouvez ajouter au maximum 10 tags" })
    }

    tags = tags.map(tag => tag.trim().toLowerCase()) 

    let blog_id = title.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .replace(/\s+/g, "-")
                .trim() +"-"+ nanoid()

    let blog = new blogs({
        title,
        des,
        banner,
        content,
        tags,
        author: authorId,
        blog_id,
        draft: Boolean(draft)
    })

    blog.save().then(blog => {

        let incrementVal = draft ? 0 : 1

        User.findOneAndUpdate(
            {
                _id: authorId
            },
            {
                $inc: { "account_info.total_posts": incrementVal },
                $push: { "blogs": blog._id }
            }
        ).then(user => {
            return res.status(200).json({ id: blog.blog_id })
        }).catch(err => {
            return res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour du nombre total d'articles" })
        })

    }).catch(err => {
        return res.status(500).json({ error: err.message })
    })
})



server.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})