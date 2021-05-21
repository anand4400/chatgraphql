const jwt = require("jsonwebtoken");
const { connections } = require("mongoose");
const db =  require( './db_config' ).getDb();


var auth = (userDetails,dbPassword) => {

  if(userDetails.password === dbPassword){
    return {
      code:200,
      message:"Login Successful",
      token:jwt.sign({data:{id:userDetails._id, email:userDetails.email, name:userDetails.name}}, 'JWT-TOKEN-TEST', {expiresIn : '30d'})
    }
  }
  return false
}


var validToken = (token) =>{

  return jwt.verify(token, 'JWT-TOKEN-TEST', (err, verifiedJwt) => {

      if(err) return {
        status :false
      }

      return {
        status : true,
        userid : verifiedJwt.data.id
      }

    })

}

const resolvers = {
  Query:{
    getGroups: async (_,__,{request}) => {

      if(!request.headers.authorization) throw new Error ("User not authenticated") 

      if(!validToken(request.headers.authorization).status) throw new Error (" Session Expired! Please Login again")
      
      return await db.collection('groups').find().toArray();

    },
    getUsers: async (_,args,{request}) => {
      
      if(!request.headers.authorization) throw new Error ("User not Authenticated") 

      if(!validToken(request.headers.authorization).status) throw new Error (" Session Expired! Please login again")

      let pageNumber = args.pageNumber || 1
      let pageSize = args.pageSize || 5;
      let offset = (pageSize * (pageNumber - 1)) || 0;

      return await db.collection('users').find().skip(offset).limit(pageSize).toArray();

    },
  },
  
  Mutation:{

    signIn: async (_,args) => {

      let user = await db.collection('users').findOne({email:args.email});
      
      if(user) return auth(user,args.password);

      return {  code:401,  message:"Invalid Credentials"  }

    },

    registerUser: async (_,args) => {
      
      let resgistered = await db.collection('users').insert( {
         name: args.name, 
         email:args.email, 
         mobleNumber:args.mobileNumber, 
         password: args.password } )

      if(resgistered.insertedCount > 0) return { code:200,  message:"Registered Successfully" , status:true }

      return {code:300, message:"Unable able to resgister!", status:false}

    },

    sendMessage: async (_, args, { pubsub , request}) =>{

      let user = validToken(request.headers.authorization);
      console.log("user : "+user.userid)
      if(!request.headers.authorization || !user.status) {
            throw new Error (" Unauthorized Access! Please login")
      }

      let dataSave = await db.collection('groups_message').insert( {
        groupID: args.groupId, 
        userID:user.userid, 
        message:args.message, 
      } )


      pubsub.publish('joinGroup', {
        joinGroup:{
            userId: user.userid,
            message: args.message
        }
      }); 
      return {status:"Message Sent" , message:args.message};
    },

  },
  Subscription:{
    joinGroup:{
      subscribe:async (_, args, {pubsub, connection})=>{

        console.log(connection)

        if(!connection.context.authorization) throw new Error ("User not authenticated!")
        
        if(!validToken(connection.context.authorization).status) throw new Error ("Session Expired! Please login again!")

        return await pubsub.asyncIterator('joinGroup');
      }
    
    }
  },
}

module.exports = resolvers;