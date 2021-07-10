var bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    express         = require('express'),
    app             = express(), 
    expressSanitizer = require('express-sanitizer');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb+srv://yelpcamp:deadlift@cluster0.lqxzy.mongodb.net/blogapp?retryWrites=true&w=majority");

app.use(express.static("public")); 
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));   
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine","ejs");
 

// Mongoose Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// RESTful rooutes-INDEX 
app.get("/",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error finding blog");
        }
        else{
            res.render("index", {blogs:blogs});
        }
    });
});

// New blog route-NEW-getting data
app.get("/new",function(req,res){
    res.render("new");
})

// Create new blog-CREATE-posting data 
app.post("/",function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            res.render("new");
        }
        else{
    //redirect to index
            res.redirect("/");
        }
    });
})

//Show page-SHOW 
app.get("/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})

//EDIT-opening the Editing blog page
app.get("/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/");
        }
        else{
            res.render("edit", {blog: foundBlog});
        }
    })

});

//UPDATE ROUTE-to update data obtained from edit page
app.put("/:id",function(req,res){
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           res.redirect("/");
       }
       else{
           res.redirect("/" + req.params.id);
       }
   });
});

// DELETE ROUTE
app.delete("/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/");
        }
    })
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });