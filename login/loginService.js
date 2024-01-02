require('dotenv').config()
const jwt = require('jsonwebtoken')
const connection = require('../database/dbconn')

const privateKey = process.env.PRIVATE_KEY;


const loginService = {
    loginUser: (req,res)=>{
        const {email, password} = req.body;
        connection.query('SELECT * from users WHERE email = ?',[email],(err,results)=>{
            if(err){
             
                res.status(500).json({message:"Error while fetching user data"});
            }else{
                if(results.length===0){
                
                    res.status(401).json({ success: false, message: "User not found" });
                }else{
                    const user = results[0];
                    if (user.roles!='agent'){
                        
                        res.status(403).json({message:"User is not an agent"})
                    }else{
                        if(password===user.password){
                            const token = jwt.sign({username:user.username,email:user.email,password:user.password,role:user.roles,customid:user.octaid},privateKey);
                            res.status(200).json({message:"Login success",token:token})
                        }else{
                            res.status(401).json({message:"Incorrect password"})
                        }
                    }
                }
            }
        })
    }
}
module.exports = loginService;