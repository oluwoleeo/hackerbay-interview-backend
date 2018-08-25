import auth from '../middlewares/auth';
import controllers from '../controllers';

const router = (app) => {
  app.post('/api/v1/login', auth.loginAuth, controllers.user.login);
  app.patch('/api/v1/patchjson', auth.allowAccess, controllers.user.patchjson);
};

export default router;
