const request = require('supertest');
const { sequelize } = require('../models');

describe('API Endpoints for User, BankAccount, Portfolio, and Trade'), () => {
    let userId, bankAccountId, portfolioId, tradeId;

    beforeAll(async () => {
        await sequelize.sync({ force: true })
    });
}

// still currently in progress