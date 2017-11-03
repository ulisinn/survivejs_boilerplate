const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.options('*', cors());

app.get('/data', ( req, res ) => {
  fs.readFile(`${__dirname}/data/data.json`, 'utf8', ( err, data ) => {

    // Error handling - return an error
    if (err) {
      res.status(500).end();
      return console.error(err);
    }
    let portfolio = JSON.parse(data);
    res.status(200).send({ portfolio });

  });
});

// start the app
app.listen(3000, () => {
  console.log('App listening on port: 3000');
});
