// Handlebar checks equality with this helper file
// See {{#if_equal id ../book.book_location_id}} in updatebook.hbs
/**and app.engine (handlebars engine setup) in app.js
 * With this setup, handlebars is able to understand the expressions like
 * {{#if_equal id ../book.book_location_id}} known as helper blocks.
 */
module.exports = {
  isEqualHelper: (a, b, opts) => {
    return a == b ? opts.fn(this) : opts.inverse(this);
  },
};
