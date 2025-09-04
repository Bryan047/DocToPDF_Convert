const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const docxtopdf = require('docx-pdf');

//Server static files form the 'uploads' dirctory
app.use(express.static('uploads'));

const bodyParser = require('body-parser');

//confiqure multer fo file uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "uploads");
    },
    filename: function (req, file, cb){
        cb(null, Date.now()+ path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage});

//Use body parser middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Serve the main HTML  Page
app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

//handle Post request for convrting Docx to PDF
app.post("/docxtopdf", upload.single('file'), (req, res) => {
    console.log('file path', req.file.path);

    //Genrate a unique output file path for the converted PDF
    let outputfilepath = Date.now() + ".pdf";

    //convert DOCX to PDF 
    docxtopdf(req.file.path, outputfilepath, (err, result) => {
        if (err){
            console.log('error', err);
        } else{
            //Download the converted PDF file
            res.download(outputfilepath, ()=> { });
        }
    });
});

//start the server on port 7337
app.listen(7337,()=>{
    console.log('App is listening on port 7337')
});