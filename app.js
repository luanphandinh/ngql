const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(bodyParser.json());

const schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String
    }

    type RootMutation {
        createEvent(event: EventInput!): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const eventsStorage = [];

const rootValue = {
	events: () => eventsStorage,
	createEvent: (args) => {
		const event = {
			_id: eventsStorage.length + 1,
			...args.event,
			date: args.event.date || new Date().toString(),
		};
		eventsStorage.push(event);

		return event;
	},
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
