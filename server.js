const express = require("express");
const {initializeApp, FirebaseError} = require("firebase/app");
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} = require("firebase/auth");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
var urlEncodeParser = bodyParser.urlencoded({extended: true});
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");

const firebaseConfig = {
    apiKey: "AIzaSyAcDRLbY5AdFIj1o432S1oj5JE6PHB2dN4",
    authDomain: "examen2ux-6152b.firebaseapp.com",
    projectId: "examen2ux-6152b",
    storageBucket: "examen2ux-6152b.appspot.com",
    messagingSenderId: "985837060880",
    appId: "1:985837060880:web:16092f1a00a76e9f445b95",
    measurementId: "G-SFQWQZSFB2",
};

const uri =
    "mongodb+srv://diegojesuschavezbotto:Pedifart123@cluster0.6ygm1rx.mongodb.net/?retryWrites=true&w=majority";

const firebaseApp = initializeApp(firebaseConfig);
app.use(urlEncodeParser);

let port = 5000;
app.listen(port, () => {
    console.log("SERVIDOR EJECUTANDOSE BIEN EN EL PUERTO", port);
});

console.log("esta linea esta despues del .listen");

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log(
            "Pinged your deploymen. You successfully connected to MongoDB!"
        );
    } catch {
        console.log("no se pudo conectar");
    } finally {
        await client.close();
    }
}

run().catch(console.dir());

//---------------------------------------------------------------------------------------------------------
app.post("/createUser", (req, res) => {
    const auth = getAuth(firebaseApp);
    const email = req.body.email;
    const password = req.body.password;
    createUserWithEmailAndPassword(auth, email, password)
        .then((resp) => {
            res.status(200).send({
                msg: "Esta es la respuesta de firebase",
                data: resp,
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(500).send({
                msg: "Error al crear el usuario",
                errorCode: errorCode,
                errorMsg: errorMessage,
            });
        });
});

//---------------------------------------------------------------------------------------------------------
app.post("/logIn", (_req, res) => {
    try {
        const auth = getAuth(firebaseApp);
        const email = _req.body.email;
        const password = _req.body.password;
        signInWithEmailAndPassword(auth, email, password)
            .then((resp) => {
                res.status(200).send({
                    msg: "Log In exitoso :)",
                    data: resp,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                res.status(500).send({
                    msg: "Error al hacer log in",
                    errorCode: errorCode,
                    errorMessage: errorMessage,
                });
            });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).send({
            msg: "Error al hacer log in",
            errorCode: errorCode,
            errorMessage: errorMessage,
        });
    }
});

//---------------------------------------------------------------------------------------------------------
// app.post("/logOut", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const auth = getAuth(app);
//     signOut(auth, email, password)
//         .then(() => {
//             res.status(200).send("log out exitoso");
//             console.log("log out exitoso");
//         })
//         .catch((error) => {
//             console.log("error en log out");
//             res.status(500).send("log out fallido");
//         });
// });

// log out del usuario actual
app.post('/logOut', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const auth = getAuth();
    signOut(auth)
        .then(() => { // response de firebase
            res.status(200).send({
                "msg": "Log out",
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(500).send({
                "msg": "Error Log out",
                "data": error.code,
            });
        });
});

const auth = getAuth();
signOut(auth).then(() => {
    // Sign-out successful.
}).catch((error) => {
    // An error happened.
});

app.post("/subirUser", async (req, res) => {
    // console.log("--- Create Post --- ");
    try {
        const client = new MongoClient(uri);
        const database = client.db("UX-Airbnb-Project");
        const post = database.collection("Users");
        // const docbody = req.body;
        const doc = 
            {
                id: req.body.id,
                username: req.body.username,
                avatar: req.body.avatar,
            };
        const result = await post.insertOne(doc);
        res.status(200).send(
            `se creo exitosamente el usuario con create post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se creo el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.post("/subirReviews", async (req, res) => {
    
    try {
        const client = new MongoClient(uri);
        const database = client.db("UX-Airbnb-Project");
        const post = database.collection("Reviews");
        // const docbody = req.body;
        const doc = 
            {
                id: req.body.id,
                date: req.body.date,
                author: req.body.author,
                rating: req.body.rating,
                text: req.body.text
            }
        const result = await post.insertOne(doc);
        res.status(200).send(
            `se creo exitosamente el usuario con create post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se creo el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.post("/subirHotels", async (req, res) => {
    // console.log("--- Create Post --- ");
    try {
        const client = new MongoClient(uri);
        const database = client.db("UX-Airbnb-Project");
        const post = database.collection("Hotels");
        // const docbody = req.body;
        const doc = 
             {
              
                id: req.body.id,
                title: req.body.title,
                image: req.body.image,
                location: req.body.location,
                rating: req.body.rating,
                pricePeerDay: req.body.pricePeerDay,

             }

    
        const result = await post.insertMany(doc);
        res.status(200).send(
            `se creo exitosamente el usuario con create post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se creo el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});


app.post("/subirTopPlaces", async (req, res) => {
    // console.log("--- Create Post --- ");
    try {
        const client = new MongoClient(uri);
        const database = client.db("UX-Airbnb-Project");
        const post = database.collection("TopPlaces");
        // const docbody = req.body;
        const doc = 
            [ {
                id: 1,
                image: ('../../assets/images/trips/2082f59465c39094ce90bebd0fcf8fa7.jpeg'),
                title: 'Amalfi Coast',
                location: 'Italy',
                description:
                    'The ultimate Amalfi Coast travel guide, where to stay, where to eat, and what areas to visit in the Amalfi Coast of Italy. Positano, Ravello, Amalfi and more',
                rating: 9.4,
                gallery: [
                    ('../../assets/images/trips/3722dd4614a5a58f2ec8ebf17c22f76d.jpeg'),
                    ('../../assets/images/trips/af933a359582704eee05be198e882be0.jpeg'),
                ],
                reviews: [2,1],
                hotels: [9,10],
            },
            {
                id: 4,
                image: ('../../assets/images/trips/922a0cb274208ccd234f6c14f2174b8b.jpeg'),
                title: 'Granada',
                location: 'Spain',
                description:
                    'Granada is the capital city of the province of Granada, in the autonomous community of Andalusia, Spain',
                rating: 8.9,
                gallery: 0,
                reviews: [1,2],
                hotels: [11,12],
            },
            {
                id: 6,
                image: ('../../assets/images/trips/e57a2a310330ee1d8928eb75d416a53d.jpeg'),
                title: 'Cherry blossoms',
                location: 'Japan',
                description:
                    "Cherry blossoms usually bloom between mid-March and early May. In 2022, Tokyo's cherry blossom season officially began on March 20",
                rating: 7.4,
                gallery: 0,
                reviews: [1,2],
                hotels: [13,14],
            },];

    
        const result = await post.insertMany(doc);
        res.status(200).send(
            `se creo exitosamente el usuario con create post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se creo el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});



app.put("/editPost/:_id", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        const filter = {_id: new ObjectId(req.params._id)};

        const updateDoc = {
            $set: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                password: req.body.password,
            },
        };

        const result = await post.updateOne(filter, updateDoc);

        res.status(200).send(
            `se actualizo exitosamente el usuario con edit post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se edito el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.delete("/deletePost/:_id", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        const query = {_id: new ObjectId(req.params._id)};
        const result = await post.deleteOne(query);

        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
        }

        res.status(200).send(`se elimino el usuario con delete post ${result}`);
    } catch (error) {
        res.status(500).send("no se elimino el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.get("/listPost", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        // const query = {};
        // const options = {
        //     // sort: {nombre: 1},
        //     projection: {id: 0, nombre: 1, apellido: 1},
        // };
        const cursor = post.find();

        if ((await post.countDocuments()) === 0) {
            console.log("No documents found!");
            res.status(200).send(`no se encontraron docuemntos`);
        }

        let arr = [];
        // Print returned documents
        for await (const doc of cursor) {
            console.dir(doc);
            arr.push(doc);
        }
        res.status(200).send({
            documentos: arr,
        });
        // console.log(`hay ${await post.countDocuments()} documentos`);
    } catch (error) {
        res.status(500).send("no se pudo leer");
        console.error(error);
    } finally {
        await client.close();
    }
    // run().catch(console.dir);
});

app.get("/listReviews", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("UX-Airbnb-Project");
        const post = database.collection("Reviews");

        // const query = {};
        // const options = {
        //     // sort: {nombre: 1},
        //     projection: {id: 0, nombre: 1, apellido: 1},
        // };
        const cursor = post.find();

        if ((await post.countDocuments()) === 0) {
            console.log("No documents found!");
            res.status(200).send(`no se encontraron docuemntos`);
        }

        let arr = [];
        // Print returned documents
        for await (const doc of cursor) {
            console.dir(doc);
            arr.push(doc);
        }
        res.status(200).send({
            documentos: arr,
        });
        // console.log(`hay ${await post.countDocuments()} documentos`);
    } catch (error) {
        res.status(500).send("no se pudo leer");
        console.error(error);
    } finally {
        await client.close();
    }
    // run().catch(console.dir);
});
