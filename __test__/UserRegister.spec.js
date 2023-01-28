const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/userModel');
const sequelize = require('../src/config/database');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

const validUser = {
      username: 'user1',
      email: 'user1@mail.com',
      password: 'P4ssword',
    }

const postUser = (user= validUser) => {
    return request(app).post('/api/1.0/users').send(user);
  };

describe('User Registration', () => {
  

  it('returns 200 when a valid register is made', async () => {
    const res = await postUser();
    expect(res.status).toBe(200);
  });

  it('returns success message when   register is made', async () => {
    const res = await postUser();
    expect(res.body.message).toBe('User created successfully');
  });

  it('saves user to database', async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('saves username and email to database', async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.email).toBe('user1@mail.com');
  });

  it('hash password in database', async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.password).not.toBe('P4ssword');
  });

  it("return 400 when username is null", async () => {
    const res = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'P4ssword',
    });
    expect(res.status).toBe(400);
  });

   it("return validationError field in response body when validation error occurs", async () => {
    const res = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'P4ssword',
    });
     const body = res.body;
    expect(body.validationErrors).not.toBeUndefined();
   });
  
    it("return username and E-mail cannot be null", async () => {
    const res = await postUser({
      username: null,
      email: null,
      password: 'P4ssword',
    });
     const body = res.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
    });
  
  //  it.each`
  //   field         | value              | expectedMessage
  //   ${'username'} | ${null}            | ${en.username_null}
  //   ${'username'} | ${'usr'}           | ${en.username_size}
  //   ${'username'} | ${'a'.repeat(33)}  | ${en.username_size}
  //   ${'email'}    | ${null}            | ${en.email_null}
  //   ${'email'}    | ${'mail.com'}      | ${en.email_invalid}
  //   ${'email'}    | ${'user.mail.com'} | ${en.email_invalid}
  //   ${'email'}    | ${'user@mail'}     | ${en.email_invalid}
  //   ${'password'} | ${null}            | ${en.password_null}
  //   ${'password'} | ${'P4ssw'}         | ${en.password_size}
  //   ${'password'} | ${'alllowercase'}  | ${en.password_pattern}
  //   ${'password'} | ${'ALLUPPERCASE'}  | ${en.password_pattern}
  //   ${'password'} | ${'1234567890'}    | ${en.password_pattern}
  //   ${'password'} | ${'lowerandUPPER'} | ${en.password_pattern}
  //   ${'password'} | ${'lower4nd5667'}  | ${en.password_pattern}
  //   ${'password'} | ${'UPPER44444'}    | ${en.password_pattern}
  // `('returns $expectedMessage when $field is $value', async ({ field, expectedMessage, value }) => {
  //   const user = {
  //     username: 'user1',
  //     email: 'user1@mail.com',
  //     password: 'P4ssword',
  //   };
  //   user[field] = value;
  //   const response = await postUser(user);
  //   const body = response.body;
  //   expect(body.validationErrors[field]).toBe(expectedMessage);
  // });

  it('return email already in use if the email exist already', async () => {
    await User.create({ ...validUser });
    const res = await postUser();
    expect(res.body.validationErrors.email).toBe('E-mail already in use');
  });

  it('return when username is null and email exist already', async () => {
    await User.create({ ...validUser });
    const res = await postUser({
      username: null,
      email: validUser.email, 
      password: "P4ssword"
    });
   const body = res.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });
});
