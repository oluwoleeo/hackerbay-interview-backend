/* eslint-disable */

import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app';

const teatToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYWEiLCJwdyI6IiQyYiQxMCRSSmV5ZDl0NFV3azBvZzBvaDVRUUF1QUNRN2d2c2RQTVBsa3VqbUd0VDhZc0ZZR0dhWHhsbSIsImlhdCI6MTUzNTIyOTU2MCwiZXhwIjoxNTY2ODUxOTYwfQ.FY06fuG1wGItvTzNSjtl5T3DJ-JNgiaTGjY1VXsmRHw';

chai.use(chaiHttp);
const { expect } = chai;

describe('App', () => {
  describe("POST request to '/api/v1/user/login' should", () => {
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

  describe('call to to authorization middleware should', () => {
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

    it('allow access to route if access token is valid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .end((err, res) => {
          expect(res).to.not.have.status(401);
          done();
        });
    });
  });

  describe("PATCH request to '/api/v1/user/patchjson' should", () => {
    it('return 400 status if JSON object is not valid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {'firstName': "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ "op": "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return 400 status if JSON patch object is not valid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ 'op': "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return JSON object invalid message if JSON object is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {'firstName': "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ "op": "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('JSON object to be updated is invalid');
          done();
        });
    });

    it('return 400 status if JSON object is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: undefined,
          jsonpatch: [{ 'op': "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return JSON object invalid message if JSON object is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: undefined,
          jsonpatch: [{ "op": "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('JSON object to be updated is invalid');
          done();
        });
    });

    it('return 400 status if JSON patch object is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: undefined
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    /* it('return JSON patch object invalid message if JSON patch object is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: undefined
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('JSON patch object for update is invalid');
          done();
        });
    });
    it('return JSON patch object invalid message if JSON patch object is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ 'op': "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" } }
          ]
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('JSON patch object for update is invalid');
          done();
        });
    });

    it('return 200 status if JSON object and patch object is valid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ "op": "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('return updated JSON object if JSON object and patch object is valid', (done) => {
      chai.request(app)
        .patch('/api/v1/user/patchjson')
        .set('x-access-token', teatToken)
        .send({
          jsontopatch: {"firstName": "Albert", "contactDetails": { "phoneNumbers": [] } },
          jsonpatch: [{ "op": "replace", "path": "/firstName", "value": "Joachim" },
            { "op": "add", "path": "/lastName", "value": "Wester" },
            { "op": "add", "path": "/contactDetails/phoneNumbers/0", "value": { "number": "555-123" }  }
          ]
        })
        .end((err, res) => {
          expect(res.body.newDocument).to.be.json();
          done();
        });
    }); */
  });

  describe("POST request to '/api/v1/user/generatethumbnail' should", () => {
    it('return 400 status if image format is not supported', (done) => {
      chai.request(app)
        .post('/api/v1/user/generatethumbnail')
        .set('x-access-token', teatToken)
        .send({
          url: 'http://www.publicengagement.ac.uk/sites/default/files/styles/content_width/public/hero/large-crowd-of-people-small.jpg?itok=bubwNIpy',
          format: 'jpge'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return format not supported message if image format is invalid/not supported', (done) => {
      chai.request(app)
        .post('/api/v1/user/generatethumbnail')
        .set('x-access-token', teatToken)
        .send({
          url: 'http://www.publicengagement.ac.uk/sites/default/files/styles/content_width/public/hero/large-crowd-of-people-small.jpg?itok=bubwNIpy',
          format: 'jpge'
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('Format not supported');
          done();
        });
    });

    it('return 400 status if URL is not valid image URL', (done) => {
      chai.request(app)
        .post('/api/v1/user/generatethumbnail')
        .set('x-access-token', teatToken)
        .send({
          url: 'http://www.publicengagement.ac.uk/sitesnvnvnv/default/files/styles/content_width/public/hero/large-crowd-of-people-small.jpg?itok=bubwNIpy',
          format: 'jpg'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('return URL not an image message if image URL is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/user/generatethumbnail')
        .set('x-access-token', teatToken)
        .send({
          url: 'http://www.publicengagement.ac.uk/sitesnvnvnv/default/files/styles/content_width/public/hero/large-crowd-of-people-small.jpg?itok=bubwNIpy',
          format: 'jpg'
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('The URL specified is not an image');
          done();
        });
    });
  });
});
