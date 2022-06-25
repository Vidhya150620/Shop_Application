

const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

var auth = require('../services/authentication');
var role = require('../services/checkRole')
// const { query } = require('../connection');
require('dotenv').config();

router.post('/signup',(req,res) =>{
    const user = req.body;
    query = "select email,password,status,role from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query= "insert into user (name,contactNumber,email,password,status,role)values(?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"successfully registered"});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                });
            }
            else{
                return res.status(400).json({message:"Email already exist"})
            }

        }else{
            return res.status(500).json(err);
        }
    })
    
})


router.post('/login',(req,res)=>{
    const user=req.body;
    query ="select email,password,role,status from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0 || results[0].password !=user.password){
                return res.status(401).json({message:"incorrect email or password"});
            }else if(results[0].status === 'false'){
                return res.status(401).json({message:"wait for admin approval"});
            }else if(results[0].password == user.password){
                const response = { email:results[0].email, role:results[0].role}
                const AccessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'800h'})
                res.status(200).json({token:AccessToken});

            }else{
                return res.status(400).json({message:"something wrong! Please try again"});
            }
            
            
        }else{
            return res.status(500).json(err);
        }
    })
})


var transporter = nodemailer.createTransport({
    service: "smtp.gmail.com",
auth:{
    user: process.env.EMAIL,
    password: process.env.PASSWORD
}
})
router.post('/forgotPassword',(req,res)=>{
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                return res.status(200).json({message:"password sent to ur email"})
            }else{
                var mailOptions ={
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "password for stationery shop application",
                    html: '<p><b>login details for your application</b><br><b>Email: </br>'+results[0].email+'<br><b>Password: </br>'+results[0].password+'<br><a href="http://localhost:4200">click here to login</p>'
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('Email sent:' +info.response);
                    }
                });
                return res.status(200).json({message:"password sent to ur email"});
            }
        }else{
            return res.status(500).json(err);
        }
    })

})


router.get('/get',auth.authenticateToken,role.checkRole,(req,res)=>{
    var query = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.patch('/update',auth.authenticateToken,role.checkRole,(req,res)=>{
    let user = req.body;
    var query = "update user set status = ? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
    if(!err){
       if(results.length <=0){
           return res.status(404).json({message:"user id doesn't exist"});
       }
       return res.status(200).json({message:"status updated successfully"});
    }
    else{
        return res.status(500).json(err)
    }
})
});


router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});
})

router.post('/changePassword',auth.authenticateToken,(req,res)=>{
    const user = req.body;
    const email = res.locals.email;
   
    var query = "select * from user where email=? and password=?";
    connection.query(query,[email,user.oldPassword],(err,results)=>{
        if(!err){
            if(results.length <=0){
                return res.status(400).json({message:"incorrect old password"});
              

            }else if(results[0].password == user.oldPassword){
                query = "update user set password=? where email=? ";
                connection.query(query,[user.newPassword,email],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Password updated suuccessfully"})
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
               
            }else{
                return res.status(400).json({message:"something wrong! Try again"})
            }
        }else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;