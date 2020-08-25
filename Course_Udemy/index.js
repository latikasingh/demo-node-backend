var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();

var multer = require('multer');
const { getVideoDurationInSeconds } = require('get-video-duration')

var MainCategory=require('../Schema/Main_Category')
var SubCategory=require('../Schema/Sub_Category')
var Courses=require('../Schema/Courses')
var Section=require('../Schema/Section')
var Lecture=require('../Schema/Lecture')
var User=require('../Schema/User')
var Checkout=require('../Schema/Checkout')

const jwthelper = require('../Helper/jwtHelper');

router.use(express.json());

router.post('/SignUp', async function (req, res) {
    const body = req.body;
       let hash = bcrypt.hashSync(body.password, 5);
       try {
           body.password = hash;
           var user = await User.create(body);
           return res.status(200).json(user);
       }
       catch (error) { 
           return res.status(500).send(error);
       }
});

router.post('/login', async function (req, res, next) {
    const body = req.body;
    try {
        var user = await User.findOne({ email: body.email });
        req.oldpwd = user.password;
        return next();
    } catch (error) {
        return res.status(500).send('email is invalid!!');
    }
},
    async function (req, res) {
        const body = req.body;
        try {
            const match = await bcrypt.compare(body.password, req.oldpwd);
            if (match) {
                var user = await  User.findOne({ password: req.oldpwd });
                var token = await jwthelper.sign(user._id, "some secret");
                return res.status(200).json({ "Id": user._id, "userrole": user.userrole, "token": token ,"email":user.email});
            }
            else
                return res.status(500).send('Password is invalid!!');
        } catch (error) {
            return res.status(500).send('email or Password is invalid!!');
        }
    });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now());
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"||file.mimetype === "image/PNG")
        cb(null, true);
    else {
        req.fileValidationError = 'Only Image file are allowed!!';
        cb(new Error('Only Image file are allowed!!'), false);
    }
}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');

router.post('/createmaincategory', async function (req, res) {
    const body=req.body
    try {
        var maincategory = await MainCategory.create(body);
        return res.status(200).json(maincategory);
    }
    catch (error) {
        if (error.code == 11000)
            return res.status(500).send('duplicate maincategory is not allowed');
        return res.status(500).send('an error occured while create mainCategory');
    }
});

router.get('/listmaincategory', async function (req, res) {
    try {
        var maincategory = await MainCategory.find({});
        return res.status(200).json(maincategory);
    }
    catch (error) {
        return res.status(500).send('an error occured get list of Main Category');
    }
});

router.post('/createsubcategory', async function (req, res) {
    const body=req.body
    try {
       var maincat=await MainCategory.findOne({MainCategoryname:body.MainCatName})
        var subcategory = await SubCategory.create({SubCategoryname:body.SubCatName,mainCategoryId:maincat._id});
        return res.status(200).json(subcategory);
    }
    catch (error) {
        return res.status(500).send('an error occured while create subCategory');
    }
});

router.get('/listsubcategory/:maincatnm', async function (req, res) {
    try {
       var maincategory=await MainCategory.findOne({MainCategoryname:req.params.maincatnm})
       var subcategory = await SubCategory.find({mainCategoryId:maincategory._id});
    
        return res.status(200).json(subcategory);
    }
    catch (error) {
        return res.status(500).send('an error occured get list of Sub Category');
    }
});

router.post('/createCourse', async function (req, res) {
    upload(req, res, async function (err) {
        if (req.fileValidationError)
            return res.status(500).send(req.fileValidationError);
        const body = req.body;
        try {
            var subcat=await SubCategory.findOne({SubCategoryname:body.subCatnm})
            var courses = await Courses.create({ ...body, image: req.file.filename,SubCategoryId:subcat._id });
            return res.status(200).json(courses);
        }
        catch (error) {
            return res.status(500).send('an error occured while create Courses');
        }
    })
});

router.get('/listcourses',async function(req,res){
    try{
        var maincategory=await MainCategory.findOne({MainCategoryname:req.query.maincatnm})
        var subcategory = await SubCategory.findOne({SubCategoryname:req.query.subcatnm,mainCategoryId:maincategory._id});
        var courses=await Courses.find({SubCategoryId:subcategory._id})
        return res.status(200).json(courses);
    }
    catch (error) {
        return res.status(500).send('an error occured while get Courses detail');
    }
})

router.get('/Coursedetail/:subcatnm/:title', async function (req, res) {
    try {
       var subcategory=await SubCategory.findOne({SubCategoryname:req.params.subcatnm})
       var courses = await Courses.findOne({title:req.params.title,SubCategoryId:subcategory._id});
        return res.status(200).json(courses);
    }
    catch (error) {
        return res.status(500).send('an error occured get detail of courses');
    }
});

router.post('/createsection', async function (req, res) {
    const body=req.body
    try {
       var course=await Courses.findOne({title:body.CourseName})
        var section = await Section.create({sectionTitle:body.sectionTitle,courseId:course._id});
        return res.status(200).json(section);
    }
    catch (error) {
        return res.status(500).send('an error occured while create section');
    }
});

var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Lectures');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now());
    }
});

const fileFilter1 = (req, file, cb) => {
    if (file.mimetype === "video/mp4")
        cb(null, true);
    else {
        req.fileValidationError = 'Only Video file are allowed!!';
        cb(new Error('Only Video file are allowed!!'), false);
    }
}

var upload1 = multer({
    storage: storage1,
    fileFilter: fileFilter1
}).single('video');

router.post('/createLecture', async function (req, res) {
    upload1(req, res, async function (err) {
         if (req.fileValidationError)
             return res.status(500).send(req.fileValidationError);
        var durationsec=0
        await getVideoDurationInSeconds(req.file.path).then((duration) => {
            durationsec=duration
        })
        const body = req.body;
        try {
            var section=await Section.findOne({sectionTitle:body.sectiontitle})
            var lecture = await Lecture.create({ ...body, video: req.file.filename,duration:durationsec,sectionId:section._id });
            return res.status(200).json(lecture);
        }
        catch (error) {
            return res.status(500).send('an error occured while create Lecture');
        }
    })
});

router.get('/sectionlecturewise/:title',async function(req,res){
    try{
       var courses = await Courses.findOne({title:req.params.title});
       var section = await Section.aggregate([
                {
                    $match:{
                        courseId:courses._id
                    }
                },
               {
                   $lookup:{
                       from:"Lecture",
                       localField:"_id",
                       foreignField:"sectionId",
                       as :"sub"
                   }
               }
           ])
       return res.status(200).json(section);
    }
    catch (error) {
        return res.status(500).send('an error occured while get Section Detail');
    }
})

router.get('/CategorybyCourse/:subcatid', async function (req, res) {
    try {
        var subcategory=await SubCategory.findById(req.params.subcatid)
        var maincategory=await MainCategory.findById(subcategory.mainCategoryId)
        return res.status(200).json({maincatnm:maincategory.MainCategoryname,subcatnm:subcategory.SubCategoryname});
    }
    catch (error) {
        return res.status(500).send('an error occured get detail of category');
    }
});

router.post('/createcheckout', async function (req, res) {
    const body=req.body
    try {
        var checkuser = await jwthelper.verify(body.accesstoken, "some secret");
        var checkout = await Checkout.create({...body,loginuserid:checkuser.data._id});
        return res.status(200).json(checkout);
    }
    catch (error) {
        return res.status(500).send('an error occured while create checkout');
    }
});

router.get('/find',async function (req,res){
    try {
        var text = req.query.search
        var courses = await Courses.find({title:{'$regex':text,'$options':'i'}});

        let newArray=[];
        for(i=0;i<courses.length;i++){
            var subcategory = await SubCategory.findById(courses[i].SubCategoryId)
            var maincategory = await MainCategory.findById(subcategory.mainCategoryId)
            newArray=[...newArray,{"courseData":courses[i],"subcatnm":subcategory.SubCategoryname,"maincatnm":maincategory.MainCategoryname}]
        }
        return res.status(200).json(newArray);
    }
    catch (error) {
        return res.status(500).send('an error occured while getting record');
    }
})

module.exports = router;