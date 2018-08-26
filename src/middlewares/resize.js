// import imgmgk from 'imagemagick';
import fs from 'fs';
import request from 'request';

const resize = (req, res) => {
  const { url } = req.body;
  const imgnam = Date.now().toString();
  const callback = () => {
    /* imgmgk.resize({
      srcPath: `image_${imgnam}.${req.body.format}`,
      dstPath: `image_${imgnam}_resized.${req.body.format}`,
      format: req.body.format,
      width: 50,
      height: 50,
    }, (err, result, stderr) => {
      if (err) {
        return res.status(400).json({ err });
      }
      res.set('content-type', `image/${req.body.format}`);
      return res.sendFile(`image_${imgnam}_resized.${req.body.format}`);
    }); */
  };

  request.get(url)
    .pipe(fs.createWriteStream(`image_${imgnam}.${req.body.format}`))
    .on('close', callback);
};
export default resize;
