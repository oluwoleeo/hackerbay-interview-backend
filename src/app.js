import express from 'express';
import logger from 'morgan';
import routes from './routes';

const app = express();

app.set('port', parseInt(process.env.PORT, 10) || 8080);
app.disable('x-powered-by');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
routes(app);

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome!' }));

app.all('*', (req, res) => res.status(404).json({ message: 'Page not found!' }));

app.listen(app.get('port')); // () => console.log(`App listening on ${app.get('port')}`);

export default app;
