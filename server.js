//npm install all the module below: npm i express path url mssql msnodesqlv8

var express = require('express');
var app = express();
var path = require('path');
var url = require('url');

var sql = require('mssql/msnodesqlv8');
var config = {
  driver: 'msnodesqlv8',
  // >>>>> change line below based on the SQL Server Native Client you have and the name of database
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={iqbal};Trusted_Connection={yes};',
};

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    sql.close();
    sql.connect(config)
    .then(function() {
        console.log('\nDB connect success');

        var request = new sql.Request();
        // >>>>> change line below based on the table name in your database
        request.query('select * from dbo.Products', function (err, result) {
            if (err) console.log(err)

            console.log(result.recordset)
        });

    })
    .catch(function(err) {
        console.log('\nDB connect error', err);
    });

});

// app.get('/add', function (req, res) {

//     sql.close();
//     sql.connect(config)
//     .then(function() {
//         console.log('\nDB connect success');

//         var request = new sql.Request();
//         request.query("insert into dbo.Products values (3, 'hp', 1000, 'laptop')", function (err, result) {
//             if (err) console.log(err)

//             console.log('success to add new row, row affected = ', result.rowsAffected)
//         });
//     })
//     .catch(function(err) {
//         console.log('\nDB connect error', err);
//     });

// });

app.get('/update', function(req, res) {

    const q = url.parse(req.url, true);
    
    sql.close();
    sql.connect(config)
    .then(function() {
        console.log('\nDB connect success');

        var request = new sql.Request();
        // >>>>> change line below based on the table name in your database
        request.query(`update dbo.Products set productname='${q.query.ticket}' where productid='${q.query.url}'`, function (err, result) {
            if (err) console.log(err)

            if (result.rowsAffected[0] > 0) console.log('success to update row, row affected = ', result.rowsAffected[0])
            else console.log('row is not found in database')
        });

        res.redirect('/');
    })
    .catch(function(err) {
        console.log('\nDB connect error', err);
    });
});

var server = app.listen(3000, function () {
    console.log('Server is running...\nListening to port 3000');
});