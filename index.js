require('dotenv').config()
const express = require('express');
const axios = require("axios");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.get('/', async (req, res) => {
    console.log("E36-APIee")
    res.send("E36-API");
})

app.post('/validate-recaptcha-token', async (req, res) => {
    try {
        const secret = process.env.RECAPTCHA_SECRET;
        const response = req.body.token;
        const uri = 'https://www.google.com/recaptcha/api/siteverify?'+`secret=${secret}&response=${response}`;
        const result = await axios({
            method: 'post',
            url: uri,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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
  console.log(`Servers running at port:${port}`);
});