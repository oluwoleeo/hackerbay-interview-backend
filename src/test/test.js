import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const teatToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYWEiLCJwdyI6IiQyYiQxMCRSSmV5ZDl0NFV3azBvZzBvaDVRUUF1QUNRN2d2c2RQTVBsa3VqbUd0VDhZc0ZZR0dhWHhsbSIsImlhdCI6MTUzNTIyOTU2MCwiZXhwIjoxNTY2ODUxOTYwfQ.FY06fuG1wGItvTzNSjtl5T3DJ-JNgiaTGjY1VXsmRHw';

chai.use(chaiHttp);
const { expect } = chai;

describe('App', () => {
  describe("POST request to '/api/v1/login' should", () => {
    it('return 400 status when username is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: '    ' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return 400 status when username is not entered', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: null })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return 400 status when password is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: 'abc', password: '    ' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return 400 status when password is not entered', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: 'abc', password: null })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return Invalid username message when username is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: '    ' })
        .end((err, res) => {
          expect(res.body.message).to.equal('Invalid username!');
          done();
        });
    });

    it('return Enter Username message when username is not entered', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: undefined })
        .end((err, res) => {
          expect(res.body.message).to.equal('Enter username!');
          done();
        });
    });

    it('return Invalid password when password is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: 'abc', password: '    ' })
        .end((err, res) => {
          expect(res.body.message).to.equal('Invalid password!');
          done();
        });
    });

    it('return Enter password message when password is not entered', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: 'abc', password: undefined })
        .end((err, res) => {
          expect(res.body.message).to.equal('Enter password!');
          done();
        });
    });

    it('return a token when username and password is entered', (done) => {
      chai.request(app)
        .post('/api/v1/user/login')
        .send({ username: 'abc', password: 'undefined' })
        .end((err, res) => {
          expect(res.body.token.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('call to to allow access middleware should', () => {
    it('return 401 status if there is no access token', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('return Not Authorized message if there is no access token', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .end((err, res) => {
          expect(res.body.message).to.equal('Not authorized for this action. Please log in!');
          done();
        });
    });

    it('return 401 status if token is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', 'xxx')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('return token invalid message if token is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', 'teatToken')
        .end((err, res) => {
          expect(res.body.message).to.equal('Token invalid/expired! Please log in again!');
          done();
        });
    });
  });
});
