let mongodb = require("mongoose")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = new mongodb.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required:true}
    },
    {
        timestamps: true
    }
)

let userCollection = mongodb.model('User', userSchema, 'users')

class UserModel{
   async getUsers  (){
        let res = await userCollection.find({})
        return res;
    }

    validatePassword = (password) =>{
        return String(password)
          .match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
          );
    }

    validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    async saveUser(body){
        if(body['name'] === undefined || body['email'] === undefined || body['password'] === undefined){
            return {code : 400, message: 'Email, password and name must be provided!'};
        }
        if(this.validateEmail(body['email']) === null){
            return {code : 400, message : "Invalid email address!"}
        }
        let password = body['password']
        if(this.validatePassword(password) === null){
            return {code: 400, message: "Password should contain at least 1 number, 1 upper, 1 lowercase and at least 8 from the mentioned characters !"}
        }
        password = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT));
        if(await userCollection.findOne({email:body['email']}) !== null){
            return {code: 409, message : "User already exists!"}
        }
        const mongoRes = await userCollection.create({name : body['name'] , email : body['email'], password});
        if (mongoRes['name'] === body["name"]){
            return {code : 201, message: "User created!"}
        }
        else{
            return {code: 500, message : "Mongo error!"}
        }
    }

    async loginUser(body){
        if(body['email'] === undefined || body['password'] === undefined){
            return {code : 400, message: 'Email and password must be provided!'};
        }
        const user = await userCollection.findOne({email:body['email']});
        if (user === null){
            return {code : 403, message: 'Wrong input!'};
        }
        if(bcrypt.compareSync(body['password'], user['password'])){
            var token = jwt.sign({
                data: {email: body['email'], id: user['id']}
              },  process.env.JWT_PK, { expiresIn: '1h' });
            return {code : 200, message:{"access_token": token}}
        }
        return {code : 403, message:'Wrong input!'}
    }

    async deleteUser(req){
        try {
            let token = req['rawHeaders'][1].slice(7)
            var decoded = jwt.verify(token, process.env.JWT_PK);
            const id = decoded['data']['id'];
            const mongoRes =  await userCollection.deleteOne({id});
            if(mongoRes['acknowledged'] === true){
                return {code: 200, message : mongoRes};
            }
            else{
                return {code :500, message: "Mongo error!" };
            }  
          } catch(err) {
                return {code : 403, message: 'Wrong input or expired token!'};
          }   
    }

    async updateUser(req, body){
        try{
            let token = req['rawHeaders'][1].slice(7)
            var decoded = jwt.verify(token, process.env.JWT_PK);
            const id = decoded['data']['id'];
            if(body["_id"] !== undefined && body['_id'] !== id){
                return {code: 400, message : "_id cannot be updated!"}
            }
            if(body['password'] !== undefined){
                let password = body['password']
                if(this.validatePassword(password) === null){
                    return {code: 400, message: "Password should contain at least 1 number, 1 upper, 1 lowercase and at least 8 from the mentioned characters !"}
                }
                password = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT));
                body["password"] = password
            }
            if(body["email"] !== undefined){
                if(this.validateEmail(body['email']) === null){
                    return {code : 400, message : "Invalid email address!"}
                }
                const user = await userCollection.findOne({email:body['email']})
                if(user !== null &&  user["_id"].toString() !== id){
                    return {code: 409, message : "User with this email already exists!"}
                }
            }
            const mongoRes = await userCollection.findByIdAndUpdate(id, body);
            if (mongoRes === null){
                return {code : 400, message: "User not found!"}
            }
            return {code: 200, message: "User successfully updated!"}
        }catch (e){
            return {code: 500, message: e}
        }
    }
    async readUser(req){
        try{
            let token = req['rawHeaders'][1].slice(7)
            var decoded = jwt.verify(token, process.env.JWT_PK);
            const id = decoded['data']['id'];
            const mongoRes = await userCollection.findById(id);
            if(mongoRes !== null){
                return {code:200, message : mongoRes}
            }
            else{
                return {code: 400, message : "User not found!"}
            }
        }catch (e){
            return {code: 500, message: e}
        }
    }
}

let model = new UserModel();

module.exports = model;