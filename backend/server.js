require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();

app.use(cors()
    // {
    // origin: 'http://localhost:3000',
    // methods: ['GET', 'POST'],
    // credentials: true,
    // }
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


app.get('/users', (req, res) => {
    const sql = "SELECT * FROM obedy_users";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/kids', (req, res) => {
    // const sql = "SELECT kid_id, kid_name, kid_surname, DATE_FORMAT(kid_birth, '%d/%m/%Y') FROM obedy_kids";
    const sql = "SELECT * FROM obedy_kids";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

// app.post('/login', (req, res) => {
//     const q = "SELECT * FROM obedy_users WHERE username = ? AND password = ?";
//     const username = req.body.username;
//     const password = req.body.password;
//     const values = [username, password];
//     console.log("values: ", values);
//     pool.query(q, values, (err, data) => {
//         console.log(err, data);
//         if (err) {
//             res.send({ err: err });
//             console.error('error connecting: ' + err.stack);
//             return;
//         }
//         else {
//             if (data.length > 0) {
//                 res.send("Success..");
//                 //***************************************************
//                 // const user = { name: username };
//                 // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//                 // res.json({ accessToken: accessToken});
//                 //***************************************************
//                 return;
//             } else
//                 console.log("Wrong username/password combination!");
//             // res.send("Wrong username/password combination!");
//             return res.status(400).send({ error: 'Wrong username/password combination!' });
//         }
//     });
// });

app.post('/login', async (req, res) => {
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
                    console.log("result[0]:", result[0].password);
                    if (response) {
                        res.send(result);
                    } else {
                        return res.status(400).send({ message: "Wrong passsword!" });
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

// app.post("/signup", (req, res) => {
//     const q = "INSERT INTO obedy_users (username, password, email) VALUES (?)";
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;
//     const values = [username, password, email];
//     console.log("values: ", values);
//     pool.query(q, [values], (err, data) => {
//         console.log(err, data);
//         if (err) return res.json({ error: err.sqlMessage });
//         //else return res.json({ data });
//         else return res.json(req.body);
//     });
// });

app.post("/signup", (req, res) => {
    const q = "INSERT INTO obedy_users (username, password, email) VALUES (?,?,?)";
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    bcrypt.hash(password, saltRound, (err, hash) => {
        const values = [username, hash, email];
        console.log("values: ", values);
        pool.query(q, values, (err, data) => {
            console.log(err, data);
            if (err) return res.json({ error: err.sqlMessage });
            //else return res.json({ data });
            else return res.json(req.body);
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
        if (err) return res.json({ error: err.sqlMessage });
        //else return res.json({ data });
        else return res.json(req.body);
    });
});

app.listen(3001, () => {
    console.log('Server started on port 3001...')
})
