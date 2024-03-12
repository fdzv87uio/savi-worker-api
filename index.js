require('dotenv').config()
const express = require('express');
const axios = require("axios");
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.options('*', cors());

const {Builder, By, Key, until} = require('selenium-webdriver');


async function scrapeTipti(query, pageNum, driver) {
let waitInterval = 7000;
    try {
        await driver.get('https://www.tipti.market'); 
        await driver.manage().window().setRect({ width: 1366, height: 720 })
        await driver.manage().setTimeouts({ implicit: waitInterval });
        await driver.get(`https://www.tipti.market/Megamaxi/Search/${query}?page=${pageNum}`);
        await driver.manage().setTimeouts({ implicit: waitInterval });
        let items = await driver.findElements(By.css("article"));
        return items;
    } catch(error){
        console.log(error);
    }
}



app.get('/', async (req, res) => {
    console.log("E36-APIee")
    res.send("Pedevco-API");
})


app.get('/crawl-tripti/:query/:pageNum', async (req, res) => {
        const { query, pageNum } = req.params;
        let driver = await new Builder().forBrowser("chrome").build();
        const result = await scrapeTipti(query, pageNum, driver);
        console.log(result);
        let resultArray = [];
        result.forEach(async (x, k)=>{
            let img = await x.findElement(By.css("img")).getAttribute("src");
            let name = await x.findElement(By.css("h3")).getText();
            let price = await x.findElement(By.className("prices__regular")).getText();
            let description = await x.findElement(By.className("prices__units")).getText();
            let newObj = {
                img:img,
                name:name,
                price:price,
                description:description,
            }
            console.log(newObj);
            resultArray.push(newObj);
            if (resultArray.length === 1 && result.length === 1){
                res.json({status:"success", data: resultArray});
                driver.quit();
            } else if (resultArray.length === result.length - 1){
                res.json({status:"success", data: resultArray});
                driver.quit();
            }
        })
       
       
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