import auth from '../middlewares/auth';
import controllers from '../controllers';
import resizeimg from '../middlewares/resize';

const router = (app) => {
  app.post('/api/v1/user/login', auth.loginAuth, controllers.user.login);
  app.patch('/api/v1/user/patchjson', auth.allowAccess, controllers.user.patchjson);
  app.post('/api/v1/user/generatethumbnail', auth.allowAccess, resizeimg);
};

export default router;
