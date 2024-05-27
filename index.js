require("dotenv").config();
const https = require("https");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.options("*", cors());
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const { Builder, By, Key, until } = require("selenium-webdriver");

//Cron Job End Point
app.get("/cron-job", async (req, res) => {
  const time = new Date().toISOString();
  const msg = `API triggered at ${time}`;
  console.log(msg);
  res.json({ status: "success", data: msg });
});

// Scrapper Function
async function scrapeFacebook(driver, page, address, cat, op) {
  let waitInterval = 20000;
  let url = `https://www.facebook.com/marketplace/item/${page}`;
  try {
    await driver.get(url);
    await driver.manage().window().setRect({ width: 1366, height: 720 });
    await driver.manage().setTimeouts({ implicit: waitInterval });
    const allWindowHandles = await driver.getAllWindowHandles();
    const closeModal = await driver.findElement(
      By.xpath(
        "/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[1]/div/div[2]/div/div/div/div[1]/div"
      )
    );
    await closeModal.click();
    await driver.switchTo().defaultContent();
    await driver.manage().setTimeouts({ implicit: waitInterval });
    const title = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/h1/span"
        )
      )
      .getText();
    const price = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/div[1]/div/span"
        )
      )
      .getText();
    await driver.manage().setTimeouts({ implicit: waitInterval });
    await driver.actions().scroll(0, 0, 0, 400).perform();
    await driver.manage().setTimeouts({ implicit: waitInterval });
    const ellipsis = await driver.findElement(
      By.xpath(
        "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]/div[8]/div[2]/div/div/div/span/div"
      )
    );
    await await ellipsis.click();
    const description = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]/div[8]/div[2]/div/div/div/span"
        )
      )
      .getAttribute("textContent");

    const city = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]/div[7]/div[3]/div/div[1]/span"
        )
      )
      .getText();
    const image1 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[1]/div/div/img"
        )
      )
      .getAttribute("src");
    const image2 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[2]/div/div/img"
        )
      )
      .getAttribute("src");
    const image3 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[3]/div/div/img"
        )
      )
      .getAttribute("src");
    const image4 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[4]/div/div/img"
        )
      )
      .getAttribute("src");
    const image5 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[5]/div/div/img"
        )
      )
      .getAttribute("src");
    const image6 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[6]/div/div/img"
        )
      )
      .getAttribute("src");
    const image7 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[7]/div/div/img"
        )
      )
      .getAttribute("src");
    const image8 = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div[1]/div/div[3]/div/div[8]/div/div/img"
        )
      )
      .getAttribute("src");
    const location = await getGeolocation(address);

    const resultItems = {
      description: `${title} - ${description.replaceAll("\n", " ")}`,
      category: cat,
      operation: op,
      address: location.formatted,
      price: parseInt(price.replaceAll("$", "").replaceAll(".", "")),
      country: "ecuador",
      city: city.toLowerCase(),
      telefono: "+593999132159",
      email: url,
      name: "Plaza Predial",
      latitude: location.latitude,
      longitude: location.longitude,
      image1: image1,
      image2: image2,
      image3: image3,
      image4: image4,
      image5: image5,
      image6: image6,
      image7: image7,
      image8: image8,
    };
    console.log(resultItems);
    const newReferal = await createReferal(resultItems);
    return newReferal;
  } catch (error) {
    console.log(error);
  }
}
// Geolocation
async function getGeolocation(query) {
  try {
    let myApiKey = process.env.OPEN_CAGE_API_KEY;
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${myApiKey}`
    );
    console.log(" OC data");
    console.log(data);
    if (data.results.length > 0) {
      const info = {
        latitude: data.results[0].geometry.lat,
        longitude: data.results[0].geometry.lng,
        formatted: data.results[0].formatted,
        data: data.results[0],
      };
      return info;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}
// Referal
async function createReferal(info) {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/referals`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      }
    );
    const data = await req.json();
    const result = { status: "success", result: data };
    return result;
  } catch (error) {
    console.log(error);
  }
}
//Home
app.get("/", async (req, res) => {
  console.log("Bienvenido a Plaza Predial API");
  res.send("Plaza-Predial-API");
});
//Get OC reverse geocoding
app.get("/geocode", async (req, res) => {
  const { lat, lon } = req.query;
  const newRes = await getGeolocation(`${lat},${lon}`);
  res.json(newRes);
});
// Facebook Add
app.get("/crawl-facebook", async (req, res) => {
  const { page, address, cat, op } = req.query;
  console.log("page: " + page);
  let driver = await new Builder().forBrowser("chrome").build();
  const result = await scrapeFacebook(driver, page, address, cat, op);
  driver.quit();
  res.json(result);
});

// Stripe Payment
app.post("/pay", async (req, res) => {
  try {
    const amount = 2000; // lowest denomination
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        name: "example payment",
        culo: "super anal",
      },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ clientSecret, message: "Payment Initiated" });
  } catch (error) {
    console.log(error.message);
  }
});
// Stripe Local Check
app.post("/stripe", (req, res) => {
  if (req.body.type === "payment_intent.created") {
    console.log(`${req.body.data.object.metadata.name} initated payment!`);
  }
  if (req.body.type === "payment_intent.succeeded") {
    console.log(`${req.body.data.object.metadata.name} succeeded payment!`);
  }
});
// Recaptcha
app.post("/validate-recaptcha-token", async (req, res) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET;
    const response = req.body.token;
    const uri =
      "https://www.google.com/recaptcha/api/siteverify?" +
      `secret=${secret}&response=${response}`;
    const result = await axios({
      method: "post",
      url: uri,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(result.data);
    res.json(result.data);
  } catch (error) {
    console.log(error);
    return null;
  }
});

app.listen(port, () => {
  console.log(`Servers running at port:${port}`);
});
