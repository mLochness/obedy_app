require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();

// Enable CORS for your frontend (React) development
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true // If you're sending cookies or authentication tokens
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_pass,
    database: process.env.DB_name
})


app.post('/api/login', (req, res) => {
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
                            "user_role": result[0].user_role,
                            "user_id": result[0].user_id,
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
                return res.status(400).json({ message: 'Wrong username/password combination!' });
            }
        }
    });
});


app.post("/api/signup", (req, res) => {
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
            if (err) return res.status(400).json({ message: err.sqlMessage });

            //else return res.json({ data });
            //else return res.status(200).json(req.body);
            else return res.status(200).json({ message: 'success' });
        });
    });

});

app.post("/api/addkid", (req, res) => {
    const q = "INSERT INTO obedy_kids (kid_name, kid_surname, kid_birth, user_id) VALUES (?)";
    const kidName = req.body.kidName;
    const kidSurname = req.body.kidSurname;
    const birthDate = req.body.birthDate;
    const userID = req.body.userID;
    const values = [kidName, kidSurname, birthDate, userID];
    console.log("values: ", values);
    pool.query(q, [values], (err, data) => {
        console.log(err, data);
        if (err) return res.json({ err });
        //else return res.json({ data });
        else return res.json(req.body);
    });
});

app.post("/api/addskip", (req, res) => {
    const q = "INSERT INTO obedy_skips (kid_id, skip_date) VALUES (?)";
    const kidID = req.body.kidID;
    const skipDate = req.body.skipDate;
    const values = [kidID, skipDate];
    console.log("values: ", values);
    pool.query(q, [values], (err, data) => {
        console.log(err, data);
        if (err) return res.status(400).json({ message: "Nastala chyba, server side" });
        else return res.status(200).json({ message: 'success' });
    });
});


/* ************************************************************* */
app.post("/api/multiskip", (req, res) => {

    const q = "INSERT INTO obedy_skips (kid_id, skip_date) VALUES ?";
    const kidID = req.body.modalKidId;
    const skipDates = req.body.datesArr;
    console.log("skipDates: ", skipDates);

    var values = [];
    skipDates.forEach(function (entry) {
        console.log("entry:", entry);
        values.push([kidID, entry]);
    });

    console.log("kidID: ", kidID);
    console.log("values: ", values);

    pool.query(q, [values], (err, data) => {
        console.log(err, data);
        if (err && err.errno == 1062) return res.status(400).json({ message: "Dátum už bol zadaný" });
        if (err) return res.status(400).json({ message: "Nastala chyba na strane servera" });
        else return res.status(200).json({ message: 'success' });
    });
});
/* ************************************************************* */


app.get('/api/users', (req, res) => {
    const sql = "SELECT * FROM obedy_users";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/api/kids', (req, res) => {
    //const sql = "SELECT kid_id, kid_name, kid_surname, kid_birth FROM obedy_kids";
    const sql = "SELECT kid_id, kid_name, kid_surname, DATE_FORMAT(kid_birth, '%d/%m/%Y') AS kid_birth FROM obedy_kids";
    ///const sql = "SELECT * FROM obedy_kids";
    pool.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.post('/api/userkids', (req, res) => {
    const userID = req.query.user_id;
    const nowSkip = req.body.nextSkipDate;
    console.log("nowSkip:", nowSkip);
    console.log("userID:", userID);
    //const sql = "SELECT k.kid_id, k.kid_name, k.kid_surname, k.kid_birth, k.user_id, s.skip_id, s.skip_date FROM obedy_kids k LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id AND s.skip_date = ? WHERE k.user_id = ? ORDER BY kid_id";
    // const sql = "SELECT k.kid_id, k.kid_name, k.kid_surname, k.kid_birth, k.user_id, s.skip_id, s.skip_date FROM obedy_kids k LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id AND s.skip_date > ? WHERE k.user_id = ? ORDER BY kid_id";
    const sql = "SELECT k.kid_id, k.kid_name, k.kid_surname, DATE_FORMAT(k.kid_birth, '%Y-%m-%d') AS kid_birth, k.user_id, s.skip_id, DATE_FORMAT(s.skip_date, '%Y-%m-%d') AS skip_date FROM obedy_kids k LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id AND s.skip_date >= ? WHERE k.user_id = ? ORDER BY kid_id";
    
    pool.query(sql, [nowSkip, userID], (err, data) => {
        if (err) return res.json(err);
        //console.log("res data:", data);
        return res.json(data);
    })
    console.log("userkids END");
})

app.delete('/api/deleteskip', (req, res) => {
    const skipID = req.body.skip_id;
    console.log("skipID:", skipID);
    const sql = "DELETE FROM obedy_skips WHERE skip_id = ?";
    pool.query(sql, [skipID], (err) => {
        if (err) return res.json(err);
        res.status(200).json({ message: 'success' });
    })
    console.log("delete skip END");
})

app.post('/api/kidskiplist', (req, res) => {
    const kidID = req.body.kid_id;
    console.log("kidID:", kidID);
    const sql = "SELECT skip_id, DATE_FORMAT(skip_date, '%Y-%m-%d') AS skip_date FROM obedy_skips WHERE kid_id = ?";
    
    pool.query(sql, [kidID], (err, data) => {
        if (err) return res.json(err);
        //res.status(200).json({ message: 'success' });
        return res.json(data);
    })
    console.log("kidskiplist END");
})

app.get('/api/sortall', (req, res) => {
    const sql = "SELECT k.kid_id, k.kid_name, k.kid_surname, k.kid_birth, u.username, COUNT(s.skip_id) AS total_skips, MAX(s.skip_date) AS last_skip FROM obedy_kids k JOIN obedy_users u ON k.user_id = u.user_id LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id GROUP BY k.kid_id ORDER BY k.kid_surname ASC;"
    pool.query(sql, (err, data) => {
        
        if (err) return res.json(err);
        console.log("data:", data);
        return res.json(data);
    })
   
})


app.listen(3001, () => {
    console.log('Server started on port 3001...');
})
