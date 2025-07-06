import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let items = [];

app.get("/", async (req, res) => {
  
  const result = await db.query("SELECT * FROM items");
  items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
      await db.query(
        "INSERT INTO items (title) VALUES ($1)",
        [item]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
});

app.post("/edit", async(req, res) => {
  
  const itemID = req.body.updatedItemId;
  const updatedItem = req.body.updatedItemTitle;
    try {
      await db.query(
        "UPDATE items SET title = $1  WHERE id = $2 ;",
        [updatedItem , itemID]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }


});

app.post("/delete", async(req, res) => {
  const itemID = req.body.deleteItemId;
  
    try {
      await db.query(
        "DELETE FROM items  WHERE id = $1 ;",
        [itemID]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
