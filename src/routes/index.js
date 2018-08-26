import auth from '../middlewares/auth';
import controllers from '../controllers';

const router = (app) => {
  app.post('/api/v1/user/login', auth.loginAuth, controllers.user.login);
  app.patch('/api/v1/user/patchjson', auth.allowAccess, controllers.user.patchjson);
};

export default router;
