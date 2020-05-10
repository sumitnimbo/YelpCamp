var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride=require("method-override"),
	flash  = require("connect-flash"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	User = require("./models/user");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
 	commentRoutes    = require("./routes/comments"),
 	indexRoutes       = require("./routes/index")


// seedDB(); //seed the database
mongoose.connect("mongodb://localhost:/yelp_camp_v13", {useNewUrlParser: true, useUnifiedTopology: true});	


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "hello i m novato",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user ;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000,function(){
	console.log("server is  listening..")
});