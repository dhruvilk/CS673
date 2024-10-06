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