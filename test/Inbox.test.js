const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

const initialMessage = 'Hi there!';
let accounts;
let inbox;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [initialMessage] })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Tests Inbox contract', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        assert.equal(await inbox.methods.message().call(), initialMessage);
    });

    it('updates the contracts message', async () => {
        assert.equal(await inbox.methods.message().call(), initialMessage);

        await inbox.methods.setMessage('new message').send({ from: accounts[0]});

        assert.equal(await inbox.methods.message().call(), 'new message');
    });
});
