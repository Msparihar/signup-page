const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");


const app = express();
client.setConfig({ apiKey: "a5e3d6c95afb1f05194b5d1831604af2", server: "us9", });


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;


    const subscribingUser = { firstName: firstName, lastName: lastName, email: email };

    const run = async() => {
        try {
            const response = await client.lists.addListMember("b642f657fa", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            res.sendFile(__dirname + "/success.html");
        } catch (err) {

            res.sendFile(__dirname + "/failure.html");
        }

    };

    run();

})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})