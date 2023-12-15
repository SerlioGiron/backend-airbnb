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
        const doc = [
             {
                id: 1,
                title: 'Argos in Cappadocia',
                image: ('../../assets/images/hotels/cp-1.jpeg'),
                location: 'Turkey, Cappadocia',
                rating: 9,
                pricePeerDay: '130$',
            },
             {
                id: 2,
                title: 'Sultan Cave Suites',
                image: ('../../assets/images/hotels/cp-2.jpeg'),
                location: 'Turkey, Cappadocia',
                rating: 9.3,
                pricePeerDay: '230$',
            },
             {
                id: 3,
                title: 'Villa Brunella',
                image: ('../../assets/images/hotels/capri-1.jpeg'),
                location: 'Italy, Capri',
                rating: 9.4,
                pricePeerDay: '280$',
            },
             {
                id: 4,
                title: 'Hotel La Floridiana',
                image: ('../../assets/images/hotels/capri-2.jpeg'),
                location: 'Italy, Capri',
                rating: 9.3,
                pricePeerDay: '190$',
            },
             {
                id: 5,
                title: "Le Taha'a by Pearl Resorts",
                image: ('../../assets/images/hotels/polynesia-1.jpeg'),
                location: 'Polynesia, Bora Bora',
                rating: 9.2,
                pricePeerDay: '250$',
            },
             {
                id: 6,
                title: 'Le Meridien Bora Bora',
                image: ('../../assets/images/hotels/polynesia-2.jpeg'),
                location: 'Polynesia, Bora Bora',
                rating: 9.4,
                pricePeerDay: '270$',
            },
             {
                id: 7,
                title: 'InterContinental Phuket Resort',
                image: ('../../assets/images/hotels/phuket-1.jpg'),
                location: 'Thailand, Phuket',
                rating: 9.2,
                pricePeerDay: '210$',
            },
             {
                id: 8,
                title: 'The Nai Harn',
                image: ('../../assets/images/hotels/phuket-2.jpeg'),
                location: 'Thailand, Phuket',
                rating: 9.4,
                pricePeerDay: '430$',
            },
             {
                id: 9,
                title: 'Hotel Poseidon',
                image: ('../../assets/images/hotels/ac-1.jpeg'),
                location: 'Italy, Amalfi Coast',
                rating: 9.2,
                pricePeerDay: '330$',
            },
             {
                id: 10,
                title: 'Le Agavi Hotel',
                image: ('../../assets/images/hotels/ac-2.jpeg'),
                location: 'Italy, Amalfi Coast',
                rating: 9.4,
                pricePeerDay: '350$',
            },
             {
                id: 11,
                title: 'Hotel Casa 1800 Granada',
                image: ('../../assets/images/hotels/granada-1.jpeg'),
                location: 'Spain, Granada',
                rating: 9.2,
                pricePeerDay: '230$',
            },
             {
                id: 12,
                title: 'Parador de Granada',
                image: ('../../assets/images/hotels/granada-2.jpeg'),
                location: 'Spain, Granada',
                rating: 9.4,
                pricePeerDay: '120$',
            },
        
             {
                id: 13,
                title: 'Konansou',
                image: ('../../assets/images/hotels/cb-1.jpeg'),
                location: 'Japan, Cherry blossoms',
                rating: 9.2,
                pricePeerDay: '740$',
            },
             {
                id: 14,
                title: 'Shuhokaku Kogetsu',
                image: ('../../assets/images/hotels/cb-2.jpeg'),
                location: 'Japan, Cherry blossoms',
                rating: 9.4,
                pricePeerDay: '240$',
            },
        ];
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
        const database = client.db("insertDB");
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
