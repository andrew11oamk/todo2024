import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js'
import { expect } from 'chai'
const base_url = 'http://localhost:3001'

describe('GET tasks', () => {
  before(() => {
    initializeTestDb()
  })

  it('should get all tasks', async () => {
    const response = await fetch(base_url + '/')
    const data = await response.json()
    expect(response.status).to.equal(200, data.error)
    expect(data).to.be.an('array')
  })
})

describe('POST register', () => {
  const email = 'newregister@foo.com'
  const password = 'register123'
  it('should register with valid email and password', async () => {
    const response = await fetch(base_url + '/user/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    expect(response.status).to.equal(201, data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id', 'email')
  })
})

describe('POST login', () => {
  const email = 'newlogin@foo.com';
  const password = 'register123';

  before(async () => {
    await insertTestUser(email, password);
  });

  it('should login with valid credentials', async () => {
    const response = await fetch(base_url + '/user/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id', 'email', 'token');
  });
});


describe('POST task', () => {
  const email = 'post@foo.com'
  const password = 'post123'
  insertTestUser(email, password)
  const token = getToken(email)
  it('should post a task', async () => {
    const response = await fetch(base_url + '/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ description: 'Task from unit test' })
    })
    const data = await response.json()
    expect(response.status).to.equal(200, data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id')
  })
    it('should not post a task without description', async () => {
    const response = await fetch(base_url + '/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({}) 
    })
    const data = await response.json()
    expect(response.status).to.equal(500, data.error) 
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('error')
  })
})

describe('DELETE task', () => {
  const email = 'delete@foo.com'
  const password = 'delete123'
  insertTestUser(email, password)
  const token = getToken(email)
  it('should delete a task', async () => {
    const response = await fetch(base_url + '/delete/1', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    const data = await response.json()
    expect(response.status).to.equal(200, data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('message')
  })
  it('should not delete a task with SQL injection', async () => {
    const response = await fetch(base_url + '/delete/1;delete from task', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    const data = await response.json()
    expect(response.status).to.equal(500, data.message)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('error')
  })
})