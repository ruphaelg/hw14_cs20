//modules
var fs = require('fs');
var readline = require('readline');
const MongoClient = require('mongodb').MongoClient;



const url = 'mongodb+srv://Ruphael:chGEAJCoF1Y3sVhb@cluster0.is4k9.mongodb.net/Stocks?retryWrites=true&w=majority'

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
 
    if (err){
        console.log("Connection error: " + err);
        return;
    }

    var dbo = db.db("Stocks");
    var coll = dbo.collection("Companies");

    var myFile = readline.createInterface({
      input: fs.createReadStream('companies.csv')
    });

    myFile.on('line', function(line) {
      var splitArray = line.split(",");

      var companyName = splitArray[0];
      var tickerCode = splitArray[1];

      var newData = {"name": companyName, "ticker": tickerCode};

      coll.insertOne(newData, function(err, res) {
          if (err) {
            console.log("Insert error: " + err);
            return;
          }

          console.log("inserted!");
      });
    });
});