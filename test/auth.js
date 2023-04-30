// test/auth.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const User = require('../models/user');

const should = chai.should();

chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(app);

describe('User', function () {
    // Log in
    it('should not be able to login if they have not registered', function (done) {
        agent.post('/login', { email: 'wrong@example.com', password: 'nope' }).end(function (err, res) {
          res.should.have.status(401);
          done();
        });
      });
      
    // signup
    it('should be able to signup', async () => {
        await User.findOneAndRemove({ username: 'testone' });
        const res = await agent.post('/signup').send({ username: 'testone', password: 'password' });
        console.log(res.body);
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
      });

    // login
    it('should be able to login', function (done) {
      agent
        .post('/login')
        .send({ username: 'testone', password: 'password' })
        .end(function (err, res) {
          res.should.have.status(200);
          agent.should.have.cookie('nToken');
          done();
        });
    });

    // logout
    it('should be able to logout', function (done) {
      agent.get('/logout').end(function (err, res) {
        res.should.have.status(200);
        agent.should.not.have.cookie('nToken');
        done();
      });
    });

      

      after(function (done) {
        User.findOneAndRemove({ username: 'testone' })
          .then(function () {
            agent.close()
      
            done()
          })
          .catch(function (err) {
            done(err);
          });
      });
});
