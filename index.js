require('dotenv').config();
const env = process.env,
    td = require("./src")(env.TD_TOKEN, env.TD_REFRESH, 413748, env.TD_CK, env.TD_CS),
    express = require('express'),
    app = express();

const redirectUri = "https://go2-parker.ngrok.io/auth/timedoctor";

app.get("/login", (req,res) => {
    res.redirect(td.Auth.getAuthUrl(redirectUri))
});

app.use("/auth/timedoctor", async (req,res,next) => {
    await td.Auth.handleCallback(req,res,redirectUri);
});

app.get("/test", async (req,res) => {
    let result  = await td.Users.getUsers(["parker@go2impact.com"]);
    res.json(result);
})

app.listen(9000, () => {
    console.log("running!");
});


const puppeteer = require("puppeteer");
async function testHeadless() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(td.Auth.getAuthUrl(redirectUri));
    await page.waitFor(6000);
    await page.evaluate('$("#username").val("parker@go2impact.com")')
    await page.evaluate('$("#password").val("sjulax22")');
    await page.waitFor(500);
    let cookies = await page.cookies();
    await page._client.send("Network.setCookies", { cookies: cookies });

    await Promise.all([
        page.click(".button-field"),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.waitFor(5000);
    await page.click("#accepted");
}