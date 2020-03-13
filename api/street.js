
var sqlite3 = require('../lib/Sqlite'),
    requireDir = require('require-dir'),
    query = requireDir('../query');

// export setup method
function setup( streetDbPath ){

  // connect to db
  sqlite3.verbose();
  var db = new sqlite3.Database( streetDbPath, sqlite3.OPEN_READONLY );

  // query method
  var q = function( ids, cb ){

    if( !Array.isArray( ids ) || !ids.length ){ return cb( 'invalid ids' ); }

    // error checking
    var fail = false;
    ids = ids.map( function( id ){
      var i = parseInt( id, 10 );
      if( isNaN( i ) ){ fail = true; }
      return i;
    });
    if( fail ){ return cb( 'non-numeric id' ); }

    try {
      // perform a db lookup for the specified street
      const res = query.street( db, ids );

      // results were found
      if( !res ){ return cb( null, null ); }

      // call callback
      cb( null, res );
    } catch (err) {
      // an error occurred
      return cb(err, null);
    }
  };

  // close method to close db
  var close = db.close.bind( db );

  // return methods
  return {
    query: q,
    close: close,
  };
}

module.exports = setup;
