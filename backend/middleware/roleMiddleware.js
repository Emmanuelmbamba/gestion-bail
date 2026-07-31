const verifierRole =
(...roles)=>{


return(req,res,next)=>{


console.log("roleMiddleware - req.user.role:", req.user?.role, "allowed:", roles);


if(!roles.includes(req.user.role)){


return res.status(403)
.json({

message:
"Permission refusée"

});


}



next();


};


};


module.exports =
verifierRole;