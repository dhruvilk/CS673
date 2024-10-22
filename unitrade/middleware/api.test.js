const { User, BankAccount, Portfolio, Trade } = require('../models'); // Import models
const { sequelize } = require('sequelize'); // Sequelize instance

describe('Database Models and Associations', () => {

  beforeAll(async () => {
    // Sync the database before running tests
    await sequelize.sync({ force: true }); // Clears DB and re-applies schema
  });

  afterAll(async () => {
    // Close DB connection after tests
    await sequelize.close();
  });

  describe('CRUD Operations', () => {

    let user, bankAccount, portfolio, trade;

    it('should create a new User', async () => {
      user = await User.create({ name: 'John Doe', email: 'john@example.com' });
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('John Doe');
    });

    it('should create a BankAccount associated with User', async () => {
      bankAccount = await BankAccount.create({ userId: user.id, balance: 1000 });
      expect(bankAccount).toHaveProperty('id');
      expect(bankAccount.balance).toBe(1000);
      expect(bankAccount.userId).toBe(user.id);
    });

    it('should create a Portfolio associated with User', async () => {
      portfolio = await Portfolio.create({ userId: user.id, name: 'My Portfolio' });
      expect(portfolio).toHaveProperty('id');
      expect(portfolio.name).toBe('My Portfolio');
      expect(portfolio.userId).toBe(user.id);
    });

    it('should create a Trade associated with Portfolio', async () => {
      trade = await Trade.create({ portfolioId: portfolio.id, stockSymbol: 'AAPL', quantity: 10 });
      expect(trade).toHaveProperty('id');
      expect(trade.stockSymbol).toBe('AAPL');
      expect(trade.portfolioId).toBe(portfolio.id);
    });

    it('should read User and associated BankAccount, Portfolio, and Trade', async () => {
      const foundUser = await User.findOne({ where: { id: user.id }, include: [BankAccount, Portfolio] });
      expect(foundUser.BankAccounts[0].balance).toBe(1000);
      expect(foundUser.Portfolios[0].name).toBe('My Portfolio');
    });

    it('should update a BankAccount', async () => {
      await bankAccount.update({ balance: 5000 });
      const updatedBankAccount = await BankAccount.findByPk(bankAccount.id);
      expect(updatedBankAccount.balance).toBe(5000);
    });

    it('should delete a Trade', async () => {
      await trade.destroy();
      const deletedTrade = await Trade.findByPk(trade.id);
      expect(deletedTrade).toBeNull();
    });
  });

  describe('Association Tests', () => {

    it('should ensure a User has many BankAccounts', async () => {
      const accounts = await user.getBankAccounts();
      expect(accounts.length).toBeGreaterThan(0);
      expect(accounts[0]).toHaveProperty('balance');
    });

    it('should ensure a Portfolio belongs to a User', async () => {
      const portfolioUser = await portfolio.getUser();
      expect(portfolioUser.id).toBe(user.id);
    });

    it('should ensure a Portfolio has many Trades', async () => {
      const trades = await portfolio.getTrades();
      expect(trades.length).toBe(0); // Since the trade was deleted earlier
    });
  });

  describe('Validation Tests', () => {

    it('should not create a User with invalid email', async () => {
      try {
        await User.create({ name: 'Jane Doe', email: 'invalid-email' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors[0].message).toContain('Validation isEmail on email failed');
      }
    });

    it('should enforce unique constraint on User email', async () => {
      try {
        await User.create({ name: 'John Doe', email: 'john@example.com' }); // Duplicate email
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors[0].message).toContain('email must be unique');
      }
    });
  });

  describe('Error Handling Tests', () => {

    it('should return an error for creating a BankAccount without a User', async () => {
      try {
        await BankAccount.create({ balance: 500 });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors[0].message).toContain('userId cannot be null');
      }
    });

    it('should handle attempts to update a non-existent User', async () => {
      try {
        await User.update({ name: 'Non Existent' }, { where: { id: 9999 } });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

// still currently in progress