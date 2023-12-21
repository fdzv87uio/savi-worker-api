require('dotenv').config()
const express = require('express');
const axios = require("axios");
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    console.log("HAHAHAHA")
    res.send("Welcome");
})

app.post('/validate-recaptcha-token', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const secret = process.env.RECAPTCHA_SECRET;
        const response = req.body.token;
        const uri = 'https://www.google.com/recaptcha/api/siteverify?'+`secret=${secret}&response=${response}`;
        const result = await axios({
            method: 'post',
            url: uri,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log(result.data);
        res.json(result.data)
    } catch (error){
        console.log(error);
        return null;
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});