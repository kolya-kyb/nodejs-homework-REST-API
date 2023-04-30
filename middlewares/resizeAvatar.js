const Jimp = require('jimp');

function resizeAvatar(req, res, next) {
  const avatarPath = req.file.path;

  Jimp.read(avatarPath)
    .then((image) => {

      return image.resize(250, 250);
    })
    .then((image) => {

      return image.writeAsync(avatarPath);
    })
    .then(() => {

      next();
    })
    .catch((err) => {

      console.error(err);
      res.status(500).send('Avatar processing error');
    });
}

module.exports = resizeAvatar;