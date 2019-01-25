var express = require("express");
var app = express();
 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true 
}));
app.use(bodyParser.json());
// Bat dau file cau hinh
var admin = require("firebase-admin");

var serviceAccount = require("./servicesAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://demonotification-1737c.firebaseio.com"
});
// Api
var firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

app.post("/sendNotification", async function (req, res){
    var title = req.body.title;
    var massage = req.body.message;
    var userID = req.body.userID;

    var notification = {
        'title' : title,
        'message' : massage,

        'createdTime' : new Date(),
    }
    try {
        var userRef = firestore.collection(userID);
        var result = await userRef.add(notification)
        console.log(result);
        res.end("success");
    } catch (error) {
        console.log(error);
        res.end('error');
    }
});
// End Api
app.use("/",function(req, res){
    res.json({
        "success": false,
        "value": null,
        "error": "Somthing went wrong!!! this is a defaut route"
    });
});
var server = app.listen(process.env.PORT || 8080, function(){
});