//modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://Ruphael:chGEAJCoF1Y3sVhb@cluster0.is4k9.mongodb.net/Stocks?retryWrites=true&w=majority'

http.createServer(function(req, res) {

    if (req.url == "/"){
      file = 'stockticker.html';
      fs.readFile(file, function(err, txt) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(txt);
          res.end();
      });
  } else if (req.url == "/getstock") {
      res.writeHead(200, {'Content-Type': 'text/html'});
      pdata = "";
      req.on('data', data => {
        pdata += data.toString();
      });

      req.on('end', () => {
        pdata = qs.parse(pdata);

        var dataRadio = pdata['radiobtn'];
        var dataInput = pdata['input_data'];
        var theQuery;

        if (dataRadio == "stock") {
            theQuery = {"ticker":dataInput};
        } else if (dataRadio == "company"){
            theQuery = {"name":dataInput};
        } else {
          console.log("Radio Button Error!");
        }
        
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err){
                console.log("Connection error: " + err);
                return;
            }
            var dbo = db.db("Stocks");
            var coll = dbo.collection("Companies");

            var result = "";

            coll.find(theQuery).toArray(function(err, items) {
              if (err) {
                console.log("Error: " + err);
              } else if (items.length == 0){
                res.write("No results found!");
                res.end();
              } else {
                for (i = 0; i < items.length; i++) {
                  result += items[i].companyName + " - "
                  result += items[i].tickerCode;
                  result += "<br>";
                }
                res.write(result);
                res.end();
              }
              db.close();
            });
        });
      });
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("Unknown page request");
      res.end();
    }
}).listen(3000);


// chGEAJCoF1Y3sVhb