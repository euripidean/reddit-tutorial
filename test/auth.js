// test/auth.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const after = require('after');
const { describe, it } = require('mocha');
const app = require('../server');

const should = chai.should();

chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(app);

const User = require('../models/user');

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
      

  after(function () {
    agent.close();
  });


});