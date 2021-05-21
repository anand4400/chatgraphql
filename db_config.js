const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://letschat:letschat@chatapp.qxxfj.mongodb.net/letschat?retryWrites=true&w=majority";

var db;

module.exports = {

  connectToServer: ( callback ) => {
    MongoClient.connect( url,  { useUnifiedTopology: true }, function( err, client ) {
      
      db  = client.db('letschat');
      return callback( err );
    } );

  },

  getDb: ( ) => {
    return db;
  }

};