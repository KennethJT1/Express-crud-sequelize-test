const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const sequelize = require('../src/config/database');


beforeAll(() => { 
  return sequelize.sync( );
});

beforeEach(() => { 
  return User.destroy({ truncate: true} );
});

describe('User Registration', () => {
  it('returns 200 when a valid register is made', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('returns success message when   register is made', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
      .then((res) => {
        expect(res.body.message).toBe('User created successfully');
        done();
      });
  });

   it('saves user to database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
      .then(() => {
        //query user table
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        })
      });
   });
  
  it('saves username and email to database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
      .then(() => {
        //query user table
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe('user1');
          expect(savedUser.email).toBe('user1@mail.com');
          done();
        })
      });
  });

    it('hash password in database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
      .then(() => {
        //query user table
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe('user1');
          expect(savedUser.password).not.toBe('P4ssword');
          done();
        })
      });
  });
});
