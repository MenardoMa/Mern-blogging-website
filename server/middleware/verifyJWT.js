import jwt from "jsonwebtoken"

/**
 * Middleware Check Auth User
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    // Vérifier que le header existe
    if (!authHeader) {
        return res.status(401).json({
            error: "Token d'accès manquant"
        })
    }

    if(token == null){
        return res.status(401).json({
            error: "Pas d'acces Token"
        })
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        
        if(err){
            return res.status(403).json({
                error: "Token invalide ou expiré"
            })
        }

        req.user = user.id
        next()

    })
    
}   