const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Template } = require('ejs');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database code
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

const itmesSchema = {
    name: String
}
const Item = mongoose.model("Item", itmesSchema);

const item1 = new Item({
    name: 'Welcome to your todolist!'
});
const item2 = new Item({
    name: 'Hit the + button to aff a new item.'
});
const item3 = new Item({
    name: '<-- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];




// Routing code
app.get("/", (req, res) => {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) console.log(err);
                else {
                    console.log('Successfully Saved')

                }
            });
            res.redirect("/");
        } else {
            res.render("List", { listTitle: "Today", newItems: foundItems });
        }
    });
    // EJS Template use 

});

app.post("/", (req, res) => {
    var item = req.body.newItem;
    if (req.body.list === 'Work') {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newItems: workItems })
});
app.post("/work", (req, res) => {
    let work = req.body.newItem;
    workItems.push(work);
    res.redirect("/work");
});
app.listen(3000, () => { console.log("Server is running at 3000") });
