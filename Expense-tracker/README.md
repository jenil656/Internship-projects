**Project:** Expense Tracker  

###  Core Requirements 

#### 1. User Interface
-  User-friendly web interface for the Expense Tracker
-  Separate sections for income and expenses
-  Input fields for date, description, category, and amount
-  Add and delete transaction buttons

#### 2. Transaction Management
-  Add income and expense transactions separately
-  Transaction categorization (Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Salary, Freelance, Investment, Other)
-  Display transaction list with details and category labels

#### 3. Calculations and Summary
-  Calculate total income
-  Calculate total expenses
-  Calculate net income (total income - total expenses)
-  Display all calculations on the page

#### 4. Styling and Responsiveness
-  CSS styling with modern, visually appealing design
-  Fully responsive for desktop, tablet, and mobile devices
-  Smooth animations and transitions

#### 5. Validation
-  Input validation for all required fields
-  Error messages for incorrect/incomplete information
-  Amount validation (must be positive number)
-  Date validation (cannot be future date)

#### 6. Persistence
-  LocalStorage implementation for data persistence
-  Data survives page refresh
-  Automatic save on every transaction

---

##  Extra Features Implemented on project 

-  **Filter transactions by category** - Dropdown filter in transactions section
-  **Data visualization** - Interactive pie chart showing expense distribution by category
-  **Edit transactions** - Click edit button to modify existing transactions
-  **Export functionality** - Export data as JSON, CSV, or PDF report
-  **Import functionality** - Import previously exported JSON/CSV files
-  **Search functionality** - Real-time search across all transactions
-  **Dark/Light theme toggle** - User preference saved
-  **Multi-currency support** - 8 currencies with automatic conversion
-  **Budget tracking** - Set monthly limits with visual progress indicators
-  **Savings goals** - Track financial goals with progress bars
-  **Recurring transactions** - Auto-populate monthly bills
-  **Bulk actions** - Select and manage multiple transactions
-  **Predictive spending** - Month-end expense projections
-  **System health check** - Validates calculation accuracy
-  **Keyboard shortcuts** - Quick actions for power users

---

##  How to Run

1. Download all files (index.html, style.css, script.js) to the same folder
2. Open `index.html` in any modern web browser
3. Start adding transactions - no installation or server required

- Application works completely offline using browser's localStorage.

---

##  Technical Implementation

### Key Technologies
- **HTML5** - Semantic markup with proper structure
- **CSS3** - Grid, Flexbox, custom properties, animations
- **JavaScript ES6+** - Modular functions, arrow functions, template literals
- **Chart.js** - Data visualization library
- **jsPDF** - PDF report generation

### Data Management
- All data stored in browser's localStorage
- Automatic saving after each operation
- Export/Import for backup and portability

##  Features 

### Dashboard
- Real-time financial summary cards (Income, Expenses, Balance, Savings Rate)
- Interactive pie chart for spending by category
- Recent transactions list
- Quick statistics display

### Transactions Management
- Add/Edit/Delete transactions
- Filter by type (All/Income/Expense)
- Filter by category
- Real-time search
- Bulk selection and actions

### Analytics
- Income vs Expense trend chart (6-month view)
- Top spending categories ranking
- AI-powered financial insights

### Budget & Goals
- Monthly budget tracking per category
- Color-coded alerts (green → orange → red)
- Savings goals with progress tracking
- Achievement notifications

---

## Design Highlights

- **Modern UI** with glassmorphism effects
- **Color-coded** information (green for income, red for expenses)
- **Smooth animations** on all interactions
- **Responsive design** works on all screen sizes
- **Dark/Light modes** with smooth transitions
- **Accessibility** features included

##  Live Demo
- Before contributing, explore the live version of the project to understand features, UI flow, and behavior:

  - Live Demo (GitHub Pages)
  ```bash
  https://jenil656.github.io/Internship-projects/Expense-tracker/
  ```
  - This helps ensure your changes align with the existing design and functionality.

## How to Contribute

- 1. Fork the Repository
     - Click the Fork button on GitHub to create your own copy of the project.

- 2. Clone Your Fork
  ```bash
        git clone https://github.com/your-username/Internship-projects.git
        cd Internship-projects/weather 
    ```
- 3. Create a New Branch
    - Always work on a separate branch:
      ```bash
          git checkout -b feature/your-feature-name
      ```

