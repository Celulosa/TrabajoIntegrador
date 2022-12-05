
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));


function recordameMiddleware(req,res, next){
    next();

    if(req.cookies.recordame != undefined && req.session.userLogged == undefined){
        
    }


}

module.exports = recordameMiddleware