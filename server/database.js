const {MongoClient} = require('mongodb');

const result = {};
result.ready = MongoClient.connect(
    process.env.MONGO_URL
    , {
        useNewUrlParser: true
    }
    )
.then(client => {
    result.db = client.db("evo2");
})
.catch(
    console.error
);

export default result;

