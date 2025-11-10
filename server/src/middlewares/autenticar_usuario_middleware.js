import jwt from 'jsonwebtoken';

export const estaAutenticado = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Usuario no autenticado, registrarse"});
    }
    jwt.verify(token, "market-sur-secret", (err, decoded) => {
        if(err){
            return res.status(401).json({message: "Token inválido"});
        }
        req.usuarioId = decoded.id;
        next();
    });
}   