var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())

var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      cb(null, 'upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})
//var upload = multer({ storage: storage }).single('file')
var upload = multer({ storage: storage }).array('file')
app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});
//Serve static assets in production.
if (process.env.NODE_ENV==='production') {
    // set static folder
    app.use(express.static('build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
