const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.use(express.urlencoded({
  extended: true
}));
app.use('/public', express.static('public'))

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw.js')(app);

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`EC Web App listening at http://localhost:${PORT}`);
});