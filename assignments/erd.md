### [ERD ](/assignments/ERD.pdf)

### Explanation of Relationships:
1. **User and BankAccount**:
   - A **User** can have multiple **BankAccounts** (1-to-many relationship).
   - A **BankAccount** belongs to one **User**.

2. **User and Portfolio**:
   - A **User** can have multiple **Portfolios** (1-to-many relationship).
   - A **Portfolio** belongs to one **User**.

3. **User and Trade**:
   - A **User** can have multiple **Trades** (1-to-many relationship).
   - A **Trade** belongs to one **User**.

4. **Portfolio and Trade**:
   - A **Portfolio** can have multiple **Trades** (1-to-many relationship).
   - A **Trade** can be related to one **Portfolio**.

---
```plaintext
+-------------------+       1        +--------------------+         *        +-------------------+
|       User        |<-------------->|   BankAccount      |<---------------->|     Portfolio     |
+-------------------+                +--------------------+                  +-------------------+
| - id: UUID        |                | - id: UUID         |                  | - id: UUID        |
| - name: String    |                | - iban: String     |                  | - asset_type:     |
| - email: String   |                | - swift: String    |                  |   String          |
| - password: String|                | - bank_name: String|                  | - quantity: Float |
|                   |                | - account_holder:  |                  | - current_price:  |
+-------------------+                |   String           |                  |   Float           |
                                     +--------------------+                  +-------------------+

               1                                      1                                      *
+-------------------+       *        +-------------------+                   +-------------------+
|     Portfolio     |<-------------->|       Trade       |------------------>|    User           |
+-------------------+                +-------------------+                   +-------------------+
| - id: UUID        |                | - id: UUID        |                   | - id: UUID        |
| - asset_type:     |                | - asset_type:     |                   | - name: String    |
|   String          |                |   String          |                   | - email: String   |
| - quantity: Float |                | - trade_type: ENUM|                   | - password: String|
| - current_price:  |                | - price: Float    |                   +-------------------+
|   Float           |                | - status: ENUM    |
+-------------------+                +-------------------+
```
