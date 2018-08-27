import jimp from 'jimp';
import path from 'path';

const resize = (req, res) => {
  const { url, format } = req.body;
  const imgnam = Date.now().toString();
  const formats = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'];
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

      const imgPath = path.join(process.cwd(), `image_${imgnam}_resized.${format}`);
      res.set('content-type', `image/${format}`);
      return res.status(200).sendFile(imgPath);
      // return res.status(200).download(imgPath, `resized thumbnail_${imgnam}.${format}`);
    })
    .catch((err) => {
      return res.status(400).json({ error: 'The URL specified is not an image' });
    });

  /* request.get(url)
    .pipe(fs.createWriteStream(`image_${imgnam}.${req.body.format}`))
    .on('close', callback); */
};
export default resize;
