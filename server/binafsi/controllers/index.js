//This controller handles requests to the landing page
function landing(req, res) {
    res.render('index.ejs', { title: 'Welcome to DigiBox' });
}

module.exports = {
    landing: landing
}