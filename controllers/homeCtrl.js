const home = (req, res) => {
    res.status(200);
    res.send('HOME PAGE');
}

const health = (req, res) => {
    res.status(200);
    res.json({ status: 'Up' });
}

module.exports = {
    home,
    health
}