import express, { Express, Request, Response } from 'express';
import { json } from 'stream/consumers';
import dbConfig from './config/db_config';
var jwt = require('jsonwebtoken');
import appConfig from './config/app_config'
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

const app: Express = express();
const port = 3000;

app.use(express.json()); 


app.post('/register', (req: Request, res: Response) => {

  const { name,pass } = req.body
  const query : String = `INSERT INTO user ( name, pass )  VALUES ( '${name}', '${pass}' ) `
  connection.connect()
  connection.query(query, function (error : any, results : any, fields : any) {
    if (error) {
      console.error(error)
      return
    };
    return
  
  });
  connection.end()
  res.status(201).json({})
});




app.post('/login', (req: Request, res: Response) => { 
  connection.connect()
  const {name, pass} = req.body

  if(name != undefined && name != "" && pass != undefined && pass != ""){

    const query:String = `SELECT * FROM user WHERE name='${name}' AND pass='${pass}'`
    connection.query(query, function (error : any, results : any, fields : any) {
      if (error) {
        console.error(error)
        return
      };
      
     if(results.length == 0){
      res.status(400).json({message : "invalid pass or name"})
      
     }else{
      var token = jwt.sign({ name,pass }, appConfig.secret);
      res.status(200).json({"acceessToken" : token})
     }

    
    });
  }else{
    res.status(400).json({message : "server cannot handle this request"})
  }
  connection.end()
});





app.get('/product/:id', (req: Request, res: Response) => { 
  connection.connect()
  if(verifyToken(req,res)){

    const query = `SELECT * FROM product WHERE id = ${req.params.id}`

    connection.query(query, function (error : any, results : any, fields : any) {
      if (error) {
        console.error(error)
        return
      };
      
      res.status(200).json({products : results,})

    
    });
  }
  connection.end()

});


const verifyToken  = (req : Request, res:Response)  : boolean | null => {

  const authHeader = req.headers['authorization'];
  
  // Pastikan header Authorization ada dan memiliki format Bearer <token>
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Memisahkan token dari string "Bearer <token>"
    const token = authHeader.slice(7);

    return jwt.verify(token, appConfig.secret, function(err:any, decoded:any) : boolean | null {
      if(err){
        res.status(400).json({message : "token invalid"})
        return null
      }else{
     
          return true
      }
    });

  }else{
    res.status(400).json({message : "token invalid"})
    return null
  }
}



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});