### [UML](/assignments/cs673-uml.pdf)
- **User**: A user has an `id`, `name`, `email`, and `password`.
- **BankAccount**: Each user can have multiple bank accounts.
- **Portfolio**: Users can have assets in a portfolio.
- **Trade**: Represents transactions with asset type, trade type (buy/sell), quantity, price, and status.
- **Middleware**: Handles token-based authentication and authorization.
- **Controllers**: The logic for registering, logging in users, fetching portfolios, and adding assets.
- **Routes**: Defines API endpoints for users and portfolios.
- **Services**: Manages business logic and interacts with the database.

```plaintext
+-------------------+         +--------------------+          +------------------+
|       User        |<------->|   BankAccount      |          |     Portfolio    |
+-------------------+         +--------------------+          +------------------+
| - id: UUID        |         | - id: UUID         |          | - id: UUID       |
| - name: String    |         | - iban: String     |          | - asset_type:    |
| - email: String   |         | - swift: String    |          |   String         |
| - password: String|         | - bank_name: String|          | - quantity: Float|
+-------------------+         | - account_holder:  |          | - current_price: |
                              |   String           |          |   Float          |
                              +--------------------+          +------------------+
                               
                                   
+------------------+         +-----------------------+
|      Trade       |<------->|    Middleware         |
+------------------+         +-----------------------+
| - id: UUID       |         | - verifyToken()       |
| - asset_type:    |         | - authenticate()      |
|   String         |         +-----------------------+
| - quantity: Float|                                         
| - trade_type:    |                                      
|   ENUM           |
| - price: Float   |
| - status: ENUM   |
+------------------+ 

+--------------------------------+          +-----------------------+
|         Controllers            |<-------->|       Routes          |
+--------------------------------+          +-----------------------+
| - registerUser()               |          | - /api/users/register |
| - loginUser()                  |          | - /api/users/login    |
| - getPortfolio()               |          | - /api/portfolio      |
| - addAsset()                   |          +-----------------------+
| - subtractAsset()              |
+--------------------------------+


+--------------------------------+          +----------------------+
|           Services             |<-------->|       Database       |
+--------------------------------+          +----------------------+
| - UserService                  |          | - PostgreSQL         |
| - BankAccountService           |          +----------------------+
| - PortfolioService             |          
+--------------------------------+
```