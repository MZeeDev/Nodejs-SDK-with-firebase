const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();
class CurdController {
  //add
  async addSkipTraceUsers(req, res) {
    try {
      let display_name = req.body.display_name;
      let photo_url = req.body.photo_url;
      let credits_available = req.body.credits_available;
      let stripe_customer_id = req.body.stripe_customer_id;
      let user_email = req.body.user_email;
      let docRef = db.collection("skiptrace_users").doc();
      const setAda = await docRef.set({
        credits_available: credits_available,
        display_name: display_name,
        photo_url: photo_url,
        stripe_customer_id: stripe_customer_id,
        user_email: user_email,
      });
      return res.status(200).json(setAda);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async getSkipTraceUsers(req, res) {
    const data = await getData();
    return res.status(200).json(data);
  }

  //this is a promise to get all documents of a collection. it is being used in another function
  async getData() {
    let counter = 0;
    let dataArr = [];
    return new Promise((resolve, reject) => {
      db.collection("skiptrace_users")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            dataArr.push(doc.data());
            counter++;
            if (counter === dataArr.length) {
              resolve(dataArr);
            }
          });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    });
  }

  async getSkipTraceUsers(req, res) {
    const data = await curdController.getData();
    res.status(200).json(data);
  }

  //getting only one users data as you asked
  getSkipTraceUserOnly(req, res) {
    let uid = req.params.uid;
    db.collection("skiptrace_users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).send("No such User document!");
          // throw new Error("No such User document!");
        } else {
          // console.log("Document data:", doc.data());
          return res.status(200).json(doc.data());
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
        return false;
      });
  }

  //updating the document

  async updateSkipTraceUser(req, res) {
    let uid = req.params.uid;
    let display_name = req.body.display_name;
    let photo_url = req.body.photo_url;
    let credits_available = req.body.credits_available;
    let stripe_customer_id = req.body.stripe_customer_id;
    let user_email = req.body.user_email;
    db.collection("skiptrace_users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // throw new Error("No such User document!");
          return res.status(404).send("No such User document!");
        } else {
          db.collection("skiptrace_users").doc(doc.id).update({
            credits_available: credits_available,
            display_name: display_name,
            photo_url: photo_url,
            stripe_customer_id: stripe_customer_id,
            user_email: user_email,
          });
          return res.status(200).send("Updated Successfully!!!");
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
        return false;
      });
  }
  //delete the entire document
  async deleteSkipUser(req, res) {
    let uid = req.params.uid;
    db.collection("skiptrace_users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("No such User document!");
        } else {
          db.collection("skiptrace_users").doc(doc.id).delete();
        }
      })
      .then(res.status(200).send("Deleted Successfully!!!"))
      .catch((err) => {
        console.log("Error getting document/Not Found", err);
        return false;
      });
  }

  //getting the data by passing stripe_customer_id

  gettingUserByStripeCustomerId(req, res) {
    let stripe_customer_id = parseInt(req.params.stripe_customer_id);
    let skipTraceUsersRef = db.collection("skiptrace_users");
    skipTraceUsersRef
      .where("stripe_customer_id", "==", stripe_customer_id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          return res.status(200).json(doc.data());
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  //2nd task
  async mockingApi(req, res) {
    try {
      // let queryParams = req.body.queryParams;
      // it will give us : /address/city=greensboro&postal_code=27406&state_code=nc&street_line_1=317+Martin+Luther+King+D
      // so queryParams are (we got, let say):
      let city = greensboro;
      let postal_code = 27406;
      let state_code = nc;
      // street_line_1 = 317 + Martin + Luther + KingD;
      // save these params as
      let myParams = {
        city: greensboro,
        postal_code: 27406,
        state_code: nc,
        street_line_1: "317MartinLutherKingD",
      };
      // we can simply do is
      let secretKey = c4bd26eb97624f1a83592d5c296191d1;
      //here firebase db will come, I am just keeping this as a parameter
      const response = await fetch(
        `process.env.baseURL/3.0/location?api_key=secretKey&city=myParams.city&postal_code=myParams.postal_code&state_code=myParams.state_code&street_line_1=myParams.street_line_1`
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  //2nd way to do this

  async mockingApiV2(req, res) {
    try {
      // let queryParams = req.body.queryParams;
      // it will give us : /address/city=greensboro&postal_code=27406&state_code=nc&street_line_1=317+Martin+Luther+King+D
      // so queryParams are (we got, let say):
      let city = greensboro;
      let postal_code = 27406;
      let state_code = nc;
      // street_line_1 = 317 + Martin + Luther + KingD;
      // save these params as
      let myParams = {
        city: greensboro,
        postal_code: 27406,
        state_code: nc,
        street_line_1: "317MartinLutherKingD",
      };
      //here I'm exposing the params into my secret function that contains secret key needs to be hide from another guys
      curdController.executingSecretKey(req, res, myParams);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  async executingSecretKey(req, res, myParams) {
    try {
      let secretKey = c4bd26eb97624f1a83592d5c296191d1;
      //here firebase db will come, I am just keeping this as a parameter
      const response = await fetch(
        `process.env.baseURL/3.0/location?api_key=secretKey&city=myParams.city&postal_code=myParams.postal_code&state_code=myParams.state_code&street_line_1=myParams.street_line_1`
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
const curdController = new CurdController();
module.exports = curdController;
