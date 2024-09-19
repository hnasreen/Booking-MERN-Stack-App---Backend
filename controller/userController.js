import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerController = async (req, res) => {

    const { name, email, password } = req.body;

    const bcryptSalt = bcrypt.genSaltSync(10)

    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const userDoc = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.json(userDoc);
        
    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: 'Error in Regirestration',
            error
        })
    }
}

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        console.log("passOk:",passOk)
        console.log("userpassword:",userDoc.password)
        if (passOk) {
            const token = jwt.sign({
                email: userDoc.email,
                id: userDoc._id
            }, process.env.JWT_SECRET, {expiresIn: "1d"})
            
            res.status(200).json({
                success: true,
                message: 'login Success',
                data: token,
                userDoc
            })
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
}

export const profileController = async (req, res) => {
const {token} = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) 
        return res.status(401).json({ success: false, message: 'Token verification failed' });;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.status(403).json({ success: false, message: 'No token provided' }); 
  }
}
