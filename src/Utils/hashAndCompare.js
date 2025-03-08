import bcrypt from "bcryptjs";
// Hash Method Take object with Named Argument And Return HashedValue
export const hash = ({ plainText = "", saltRound = process.env.SALT_ROUND } = {}) => {
     const hashedValue = bcrypt.hashSync(plainText, parseInt(saltRound));
     return hashedValue;
}
// Compare Method Take object with Named Argument And Return True Or False
export const compare = ({ plainText = "", hashedValue = "" } = {}) => {
     const match = bcrypt.compareSync(plainText, hashedValue);
     return match;
}