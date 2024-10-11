# CS-673
## Roster: Group 2 (UniTrade – Registration and Trade Data Entry) 
- Angelo Velardi - Data Architect
- Dhruvil Kansara - PM
- Emmanuel Chiobi - QA/DevOps
- Josef Birman - Microservices Developer
- Saketh Lakshmanan Sathiskumar - UI/UX Dev

### **Project Directory Structure:**

```
/uniTrade
|-- /config        # Database and environment configuration
|-- /controllers   # Business logic for each module
|-- /models        # Sequelize models (User, BankAccount, Portfolio, etc.)
|-- /routes        # API endpoints for each module
|-- /middleware    # Authentication, validation middleware
|-- /services      # Service layer for business logic
|-- /utils         # Utility functions (e.g., encryption)
|-- /migrations    # Database migration scripts
|-- /public        # Static assets (optional for frontend)
|-- /docs          # API documentation
|-- app.js         # Main entry point
|-- package.json   # Project dependencies
```
### **Project Usage:**
```
#### Step 1: Initialize the Project
Run these commands in the terminal:
```bash
git clone https://github.com/dhruvilk/CS673.git
cd uniTrade
npm init -y
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv cors body-parser helmet
```

#### Step 2: Initialize Sequelize
```bash
npx sequelize-cli init
```
