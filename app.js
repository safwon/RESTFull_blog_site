var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var method = require('method-override');
var mongoose = require('mongoose');
var ejs = require('ejs');


mongoose.connect('mongodb://localhost/Restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(method("_method"));



const BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: { type: Date, default: Date.now }
});
var Blog = mongoose.model('Blog', BlogSchema);



app.get("/", (req, res) => {
    res.redirect("/blogs")
})
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs })
        }
    })

})

app.get("/blogs/new", (req, res) => {
    res.render("new");
})

app.post("/blogs", (req, res) => {

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs")
        }
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundbody) => {
        if (err) {
            res.redirect("new");
        } else {
            res.render("show", { blog: foundbody });
        }

    })
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundbody) => {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", { blog: foundbody })
        }
    })

})
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updated) => {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Restful_blog_app started! port:3000")
    console.log("http://localhost:3000/blogs")
})