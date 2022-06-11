const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require("../db")

class UserModel{
   
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
        const users_email = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [body['email']])
        if(users_email.rows.length !== 0){
            return {code: 409, message : "User already exists!"}
        }
        const create_user = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1::text, $2::text, $3::text)`, [body['name'], body['email'], password])
        if (create_user.rowCount == 1){
            return {code : 201, message: "User created!"}
        }
        else{
            return {code: 500, message : "Database error!"}
        }
    }

    async loginUser(body){
        if(body['email'] === undefined || body['password'] === undefined){
            return {code : 400, message: 'Email and password must be provided!'};
        }
        var user = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [body['email']])
        if (user.rows.length === 0){
            return {code : 403, message: 'Wrong input!'};
        }
        user = user.rows[0]
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
            var res = await pool.query(`DELETE FROM users WHERE id = $1::int`, [id])
            
            if(res.rowCount === 1){
                return {code: 200, message : "User has been deleted successfully!"};
            }
            if(res.rowCount === 0){
                throw "User not found";
            }
            else{
                return {code :500, message: "Database error or user not found!" };
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
            if(body["id"] !== undefined && body['id'] !== id){
                return {code: 400, message : "id cannot be updated!"}
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
                const user = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [body['email']])
                if(user.rows.length !== 0 &&  user.rows[0]["id"].toString() !== id){
                    return {code: 409, message : "User with this email already exists!"}
                }
            }
            
            var user = await pool.query(`SELECT * FROM users WHERE id = $1::int`, [id])
            if (user.rows.length === 0){
                return {code : 400, message: "User not found!"}
            }
            for(const field in body){
                if(field in user.rows[0]){
                    if(field === 'name')
                        await pool.query('UPDATE users SET name = $1 WHERE id = $2', [body[field], id])
                    if(field === 'email')
                        await pool.query('UPDATE users SET email = $1 WHERE id = $2', [body[field], id])
                    if(field === 'password')
                        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [body[field], id])    
                }
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
            var user = await pool.query(`SELECT * FROM users WHERE id = $1::int`, [id])
            if(user.rows.length !== 0){
                return {code:200, message : user.rows[0]}
            }
            else{
                return {code: 400, message : "User not found!"}
            }
        }catch (e){
            return {code: 400, message: e}
        }
    }
}

let model = new UserModel();

module.exports = model;