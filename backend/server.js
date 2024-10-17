require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();

app.use(cors()
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'obedy_app'
})

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'obedy_app'
})


app.post('/login', (req, res) => {
    const q = "SELECT * FROM obedy_users WHERE username = ?";
    const username = req.body.username;
    const password = req.body.password;
    const values = [username, password];
    console.log("values: ", values);
    pool.query(q, [username], (err, result) => {
        console.log(err, result);
        if (err) {
            res.send({ err: err });
            console.error('error connecting: ' + err.stack);
            return;
        }
        else {
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    console.log("password compare:", password, result[0].password);
                    console.log("comparation result:", response);
                    console.log("user role:", result[0].user_role);
                    if (response) {
                // ***************************************************
                const user = { name: username };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                res.status(200).json({ 
                    accessToken: accessToken, 
                    "user_role" : result[0].user_role, 
                    "user_id" : result[0].user_id,
                    "user_name": username,
                    "message": "success"
                });
                //***************************************************
                return;
                    } else {
                        // return res.send({ message: "Wrong passsword!" });
                         return res.status(400).json({ message: 'Wrong username or password' });
                    }
                });
                return;
            } else {
                console.log("Wrong username/password combination!");
            return res.status(400).json({message: 'Wrong username/password combination!' });
            }
        }
    });
});


app.post("/signup", (req, res) => {
    const q = "INSERT INTO obedy_users (username, password, email, user_role) VALUES (?,?,?,?)";
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    bcrypt.hash(password, saltRound, (err, hash) => {
        const values = [username, hash, email, role];
        console.log("values: ", values);
        pool.query(q, values, (err, data) => {
            console.log(err, data);
            //if (err) return res.status(400).json({ error: err.sqlMessage });
            if (err) return res.status(400).json({message: err.sqlMessage });
            
            //else return res.json({ data });
            //else return res.status(200).json(req.body);
            else return res.status(200).json({ message: 'success' });
        });
    });

});

app.post("/addkid", (req, res) => {
    const q = "INSERT INTO obedy_kids (kid_name, kid_surname, kid_birth, user_id) VALUES (?)";
    const kidName = req.body.kidName;
    const kidSurname = req.body.kidSurname;
    const birthDate = req.body.birthDate;
    const userID = req.body.userID;
    const values = [kidName, kidSurname, birthDate, userID];
    console.log("values: ", values);
    pool.query(q, [values], (err, data) => {
        console.log(err, data);
        if (err) return res.json({err});
        //else return res.json({ data });
        else return res.json(req.body);
    });
});

app.post("/addskip", (req, res) => {
    const q = "INSERT INTO obedy_skips (kid_id, skip_date) VALUES (?)";
    const kidID = req.body.kidID;
    const skipDate = req.body.skipDate;
    const values = [kidID, skipDate];
    console.log("values: ", values);
    pool.query(q, [values], (err, data) => {
        console.log(err, data);
        if (err) return res.status(400).json({message: "Nastala chyba, server message" });
        //if (err) return res.status(400).json({err});
        //else return res.json({ data });
        //else return res.json(req.body);
        else return res.status(200).json({ message: 'success' });
    });
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM obedy_users";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/kids', (req, res) => {
    //const sql = "SELECT kid_id, kid_name, kid_surname, kid_birth FROM obedy_kids";
    //const sql = "SELECT kid_id, kid_name, kid_surname, DATE_FORMAT(kid_birth, '%d/%m/%Y') FROM obedy_kids";
    const sql = "SELECT * FROM obedy_kids";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/userkids', (req, res) => {
    const userID = req.query.user_id;
    console.log("req.query", req.query);
    console.log("userID:", userID);
    const sql = "SELECT * FROM obedy_kids WHERE user_id=?";
    //const sql = "SELECT kid_id, kid_name, kid_surname, kid_birth, user_id FROM obedy_kids";
    //pool.query(sql, (err, data) => {
    pool.query(sql, [userID],(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
    console.log("/userkids RUN");
})

app.listen(3001, () => {
    console.log('Server started on port 3001...')
})
