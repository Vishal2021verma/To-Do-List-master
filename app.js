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

const listSchema = {
    name: String,
    items: [itmesSchema]
};
const List = mongoose.model('List', listSchema);




// Routing code
app.get("/", (req, res) => {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) console.log(err);
                else {
                    console.log('Successfully Saved');
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
    var itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    })
    item.save();
    res.redirect('/');
});

app.get("/:customListName", function(req, res){
    
    const customsListName = req.params.customListName;
    console.log(customsListName);

    List.findOne({name:customsListName}, function (err, foundList){
        if(!err){
            if(!foundList){
                // create new list
                const list = new List({
                    name: customsListName,
                    items:defaultItems
                }); 
                list.save();
                console.log("Doesn't exist!");
                res.redirect('/' + customsListName);
            }else{
                //show an exiting list
                res.render("list", { listTitle: foundList.name, newItems: list.items });

                console.log("Exits");
            }
        }
    });

    const list = new List({
        name: customsListName,
        items:defaultItems
    }); 
    list.save();
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
