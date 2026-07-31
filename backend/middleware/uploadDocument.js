const multer=require("multer");

const {
CloudinaryStorage
}
=require(
"multer-storage-cloudinary"
);


const cloudinary=
require("../config/cloudinary");



const storage =
new CloudinaryStorage({

cloudinary,


params:{

folder:"contrats-signes",

resource_type:"auto"

}

});



module.exports =
multer({
storage
});