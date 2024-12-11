import {ApolloServer, gql} from 'apollo-server';
import { db } from "./connection.js";

const typeDefs = gql`

type Query {
    users: [User]
  }

  type Query{
    getUserById(id: ID!): [User]  
  }

type User{
        id: ID!
        emp_id: Int
        name: String
        address: String
        age: Int
        phone: Int
        gender: String
    }

input userInput {
    id: ID!
    emp_id: Int
    name: String
    address: String
    age: Int
    phone: Int
    gender: String
    }

type Mutation {
    addUser(input: userInput!): User!
    updateUser(input: userInput!): User!
}
`;

const resolvers = {
  Query: {
    users: async () => {
      return new Promise((resolve, reject) => {
        const sql = 'CALL CrudUser("GetAll", NULL, NULL, NULL, NULL, NULL, NULL, NULL)'; 
        db.query(sql, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result[0]); 
        });
      });
    },

    getUserById: async(_, {id})=>{
      return new Promise((resolve, reject)=>{
        const sql = `CALL CrudUser("GetById", ?, NULL, NULL, NULL, NULL, NULL, NULL)`;
        db.query(sql, id, (err, result)=>{
          if(err){
            return reject(err);
          } else{
            console.log(result[0])
            resolve(result[0]);
          }
        })
      })
    }
  },
    Mutation: {
        addUser: async (_, { input }) => {
          const { id, emp_id, name, address, age, phone, gender } = input;
          try {
            return new Promise((resolve, reject)=>{
              const sql='CALL CrudUser("Insert", ?, ?, ?, ?, ?, ?, ?)';
              const values = [id, emp_id, name, address, age, phone, gender];
              db.query(sql, values, (err, result)=>{
                if(err){
                  return reject(err);
                } else{
                  result={
                    id,
                    emp_id,
                    name,
                    address,
                    age,
                    phone,
                    gender
                };
                console.log(result);
                  return resolve(result);
                }
              })
            })


            // Construct and return the newly inserted user object
          
          } catch (err) {
            console.error('Error adding user:', err);
            throw err; // Throw error back to Apollo Server
          }
        },

      updateUser: async (_, {input})=>{
        const { id, emp_id, name, address, age, phone, gender } = input;
        try{
          return new Promise((resolve, reject)=>{
            const sql= `CALL CrudUser('Update', ?, ?, ?, ?, ?, ?, ?)`;
            const values = [id, emp_id, name, address, age, phone, gender];
            db.query(sql, values,(err, result)=>{
              if(err){
                return reject(err);
              } else{
                 result = {
                  id,
                  emp_id,
                  name,
                  address,
                  age,
                  phone,
                  gender,
                };
                console.log(result);
                return resolve(result)
              }
            })
          })

        } catch(error){
          console.error(error);
        }
      }
  },

}

const server = new ApolloServer({typeDefs, resolvers, playground: true});

server.listen().then(({url})=>{
    console.log(`🚀  Server ready at: ${url}`);
})