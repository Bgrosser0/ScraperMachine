// RENDER THE FIRST EXPO PAGE
router.get("/", function (req, res) {
    console.log("THIS IS WORKING")
    // res.type('text/plain')
    var hbsObject = {
    };
    res.render("index", hbsObject);
});