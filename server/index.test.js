import { expect } from "chai"
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js";
const baseUrl = 'http://localhost:3001/';

describe('GET tasks',() => {
    before(() => {
        initializeTestDb()
    })

    it ('should get all tasks',async() => {
        const response = await fetch(baseUrl)
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
    })
})

describe('POST task',() => {

    const email = 'demo100@mail.com'
    const password = '12345678'
    insertTestUser(email,password)
    const token = getToken(email)
    
    it ('should post a task',async() => {
        const response = await fetch(baseUrl + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not post a task without description',async() => {
        const response = await fetch(baseUrl + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE task',() => {

    const email = 'demo@mail.com'
    const password = '12345678'
    insertTestUser(email,password)
    const token = getToken(email)

    it ('should delete a task',async() => {
        const response = await fetch(baseUrl + 'delete/1',{
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not delete a task with SQL injection',async() => {
        const response = await fetch(baseUrl + 'delete/id=0 or id >0',{
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe ('POST register',() => {
    const email = 'demo12@mail.com'
    const password = '12345678'
    it ('should register with valid email and password',async() => {
        const response = await fetch(baseUrl + 'user/register',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')
    })
})

describe ('POST login',() => {
    const email = 'demo9@mail.com'
    const password = '12345678'
    insertTestUser(email,password)
    it ('should login with valid credentials',async() => {
        const response = await fetch(baseUrl+ 'user/login',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')
    })
})