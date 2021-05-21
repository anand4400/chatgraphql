const connect = require( './db_config' );


connect.connectToServer( ( err ) => {

if (err) throw new Error ("Database not connected!");

  console.log("database connected!")
  const { GraphQLServer, PubSub } = require("graphql-yoga");
  const typeDefs = require("./typeDefs");
  const resolvers = require("./resolvers");
  const pubsub = new PubSub();

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context:({ request ,  connection} ) => {
      return {
        request,
        connection,
        pubsub,
      }
    }, 
  });
  
  const options = {
    port: process.env.PORT || 3000,
    endpoint: '/',
    playground:"/",  
  };

  server.start(options,({ port}) => {
    console.log(
      `Graphql Server started, listening on port ${port} for incoming requests.`
    );
  });

});



