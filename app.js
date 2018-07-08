var express             = require("express"),
    app                 = express(),
    bodyparser          = require("body-parser"),
    mongoose            = require("mongoose"),
    sanitizer           = require("express-sanitizer"),
    methodOverride      = require("method-override");
    
// ********************************************* Set up the working environment
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());
mongoose.connect("mongodb://localhost/blogNew");

//*********************************************** Configuration of Schema Model
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Cute one",
//     image: "https://images.pexels.com/photos/887532/pexels-photo-887532.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body: "Meet this little cuty.."
// });

// ****************************************************************
// ********************************************** ReSTful Routes***
// ****************************************************************

app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});

// --------------------INDEX ROUTE---------------------------

app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    });
});

// --------------------NEW POST ROUTE-------------------------
app.get("/blogs/new",function(req,res){
    res.render("addBlog");
});

// --------------------CREATE POST ROUTE----------------------
app.post("/blogs",function(req,res){
    // sanitizing the body contents(removing scripts)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("addBlog");
            alert("Some Error Occured. Try Again!");
        } else {
            // redirect to index
            res.redirect("/blogs");
        }
    });
});

// --------------------- Show Post----------------------------
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
            alert("Try Again!");
        } else {
            res.render("post", {blog: foundBlog});
        }
    });
});


// ---------------------Edit Post Route-----------------------

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, editBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs/"+req.params.id);
            alert("Try Again!");
        } else{
            res.render("edit", {blog: editBlog});
        }
    });
});

// ---------------------Update Post Route----------------------

app.put("/blogs/:id", function(req,res){
    // Sanitizing Content
     req.body.blog.body = req.sanitize(req.body.blog.body);
    // updating the post
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs/"+ req.params.id);
            alert("Try Again!");
        } else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

// ----------------------DELETE Post Route-----------------------

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs/");
            alert("Try Again! Error Occured");
        } else{
            res.redirect("/blogs");
        }
    });
});




// --------------Liten PORT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Connected!!");
});