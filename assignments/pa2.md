# Entities and their attributes owned by your team 
# API documentation (contract only) that your team owns
# Test cases for testing above APIs
This section explains the test file structure for validating the database schema, models, and associations based on an Entity-Relationship Diagram (ERD). The tests cover **CRUD operations**, **model associations**, **validation tests**, and **error handling** for the ```User```, ```BankAccount```, ```Portfolio``` and ```Trade``` models.
## Acceptance Criteria
The test cases follow the acceptance criteria below:
1. Unit tests cover all CRUD operations for the ```User```, ```BankAccount```, ```Portfolio``` and ```Trade``` models.
2. Association tests ensure correct relationships and foreign keys between models.
3. Validation tests confirm that model constraints (unique, format, enum) are enforced.
4. Error handling is tested and provides meaningful feedback for invalid operations.
5. All tests pass without issues, and the relationships in the ERD are accurately reflected in the data models.
## Test File Structure
The test file (```api.test.js```) is structured into several sections:
### 1. CRUD Operations Test
This section tests the basic create, read, update, and delete (CRUD) operations for the ```User```, ```BankAccount```, ```Portfolio``` and ```Trade``` models.
- **Create Operation**: Tests for creating a new user, bank account, portfolio, and trade.
- **Read Operation**: Tests fetching a user along with their associated bank accounts and portfolios.
- **Update Operation**: Tests updating the balance of a bank account.
- **Delete Operation**: Tests deleting a trade.
### 2. Association Tests
This section ensures that the association between the models are correctly defined based on the ERD and verifies the following:
- A ```User``` can have many ```BankAccounts```.
- A ```Portfolio``` belongs to a ```User```.
- A ```Portfolio``` can have many ```Trades```.
### 3. Validation Tests
This section verifies that the model validations and constraints are correctly enforced. Tests include:
- Ensuring that a ```User``` cannot be created with an invalid email format.
- Ensuring that the ```User``` email must be unique.
### 4. Error Handling Tests
This section tests how the application handles errors for invalid operations. Tests include:
- Trying to create a ```BankAccount``` without a valid ```User``` ID.
- Attempting to update a non-existent ```User```.
# APIs that your stories will need, but will be provided by other teams
# What stories from your backlog are being worked upon
# Make sure that you include the pivotal tracker link where you are showing all your agile artifacts.