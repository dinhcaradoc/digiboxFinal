//Database configuration
module.exports = {
    'secret': "Nobodyhaffiknow",
    'database': getDbaseUrl()
};

function getDbaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.MONGO_URL || 'mongodb+srv://Wambugu:Kanairo@2023!@cluster0.t01ouae.mongodb.net/?retryWrites=true&w=majority'; 
    } else {
        return 'mongodb://127.0.0.1:27017/digibox-new'
    }
}