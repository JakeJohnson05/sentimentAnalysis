const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('appSentimentAnalysis'));
app.use(express.static('node_modules/nouislider/distribute'));
app.get('/', (req, res) => res.sendFile('sentimentAnalysis.html', {root: `${ __dirname }/appSentimentAnalysis`}));

app.listen(port, () => console.log(`expressScheduler active on port ${ port }`));