const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function (app) {
  app.engine('hbs', exphbs({
    // defaultLayout: 'main.hbs'
    defaultLayout: 'bs4.hbs',
    helpers: {
      section: hbs_sections(),
      format_number(val) {
        return numeral(val).format('0,0');
      }
    }
  }));
  app.set('view engine', 'hbs');
}