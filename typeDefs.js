
const typeDefs = `

    type Users{
        _id:String,
        name:String,
        email:String,
        mobileNumber:String,
        status:String,
    }
    type SignIn{
        token:String,
        message:String,
        code:String,
    }

    type RegisterUser{
        code:String!,
        data:String!,
        error:String,
        message:String,
    }

    type Groups{
        _id:ID!
        message:String!
        code:Int,
        groupName:String!
        groupid:ID!,
        status:String
    }


    type GroupMessage{
        _id:String
        group:String
    }
    type Query {
        getGroups(groupID: ID):[Groups!]!
        getUsers(pageSize:Int, pageNumber:Int):[Users]
    }

    type Mutation{
        registerUser(email:String!, password:String!, name:String!, mobileNumber:Int!):RegisterUser!
        signIn(email:String!, password:String!):SignIn
        sendMessage(groupId:ID! ,message:String!): Groups!
    }
    type Subscription {
        joinGroup(group:String!): GroupSubscriptionPayload!
    }
    
    type GroupSubscriptionPayload {
        userId: ID!
        userName : String
        message: String!
    }
`;

module.exports = typeDefs;