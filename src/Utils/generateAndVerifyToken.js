import jwt from "jsonwebtoken";
// Generate Token 
export const generateToken = ({ payload = {}, signature = process.env.TOKEN_SIGNATURE, expiresIn = 60 * 60 } = {}) => {
     const token = jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) })
     return token;
}
// Verify Token
export const verifyToken = ({ token = {}, signature = process.env.TOKEN_SIGNATURE } = {}) => {
     const decoded = jwt.verify(token, signature)
     return decoded;
}