const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(bodyParser.json());

const schema = buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const rootValue = {
    events: () => ["Coding", "Drinking coffee", "Sleep"],
    createEvents: (args) => console.log(arg),
};

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		rootValue,
		graphiql: true,
	})
);

app.listen(5000);
