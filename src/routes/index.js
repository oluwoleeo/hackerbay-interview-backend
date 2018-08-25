import authen from '../middlewares/auth';
import controllers from '../controllers';

const router = (app) => {
  app.post('/api/v1/users/login', authen.loginAuth, controllers.user.login);
};

export default router;
