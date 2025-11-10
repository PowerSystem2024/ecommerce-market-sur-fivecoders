import jwt from 'jsonwebtoken';

export const generarToken = (payload) => {
    return new Promise((resolve, reject) =>{
        jwt.sign(
            payload, "market-sur-secret",
            {expiresIn: '1d'},
            (err, token) => {
                if(err) reject(err);
                resolve(token); //devuelve el token generado
            }
        );
    });
};