import jimp from 'jimp';
import path from 'path';
import fs from 'fs';

const resize = (req, res) => {
  const { url, format } = req.body;
  const imgnam = Date.now().toString();
  const formats = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'];
  let imgPath = 'xxx';
  let rightFormat = 0;


  formats.forEach((element) => {
    if (format === element) {
      rightFormat += 1;
    }
  });

  if (rightFormat !== 1) {
    return res.status(400).json({ error: 'Format not supported' });
  }

  jimp.read(url)
    .then((img) => {
      img
        .resize(50, 50)
        .write(`image_${imgnam}_resized.${format}`);

      imgPath = path.join(process.cwd(), `image_${imgnam}_resized.${format}`);
      console.log(imgPath);
      res.set('Content-Type', `image/${format}`);
      return res.status(200).sendFile(imgPath);
      // return res.status(200).download(imgPath, `resized thumbnail_${imgnam}.${format}`);
    })
    .catch((error) => {
      if (fs.existsSync(imgPath)) {
        console.log(imgPath);
        console.log(error);
        console.log(`Code is ${error.code}`);
        console.log(`Message is ${error.message}`);
        return res.status(500).json({ error: 'Error occured while sending image to user' });
      }

      if (error.code === 'ENOTFOUND' || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log(imgPath);
        console.log(error);
        console.log(`Code is ${error.code}`);
        console.log(`Message is ${error.message}`);
        return res.status(500).json({ error: 'Network connection error. Unable to access image URL' });
      }

      console.log(imgPath);
      console.log(error);
      console.log(`Code is ${error.code}`);
      console.log(`Message is ${error.message}`);

      return res.status(400).json({ error: 'The URL specified is not an image' });
    });

  /* request.get(url)
    .pipe(fs.createWriteStream(`image_${imgnam}.${req.body.format}`))
    .on('close', callback); */
};
export default resize;
