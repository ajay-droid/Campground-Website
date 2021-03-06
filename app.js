var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campgrounds");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");

var commentRoutes= require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true ,useUnifiedTopology: true });
//mongodb+srv://ajay:<password>@cluster0-tleo4.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://ajay:exel17599@cluster0-tleo4.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser:true,
	useUnifiedTopology: true 
	
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:',err.message);
});

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();  //seeding the database 
//Passport Configuration

app.use(require("express-session")({
	secret:"Once again Rusty wins cutest dog!!",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//middleware route handler
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
	next();
});



//  ==============
// COMMENTS ROUTES
// ==============



//Auth Routes

//use the routes

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
console.log("YelpCamp is running!!");
});
