ExpenseGroup.create(
  [
    {
      name: "Income",
      expense_categories: [
        ExpenseCategory.new({ name: "salary" }),
        ExpenseCategory.new({ name: "taxes" }),
        ExpenseCategory.new({ name: "bonuses" }),
        ExpenseCategory.new({ name: "rewards" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },
    {
      name: "Housing",
      expense_categories: [
        ExpenseCategory.new({ name: "Mortgage" }),
        ExpenseCategory.new({ name: "HOA" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },
    {
      name: "Education",
      expense_categories: [
        ExpenseCategory.new({ name: "Books & Supplies" }),
        ExpenseCategory.new({ name: "Tuition" }),
        ExpenseCategory.new({ name: "College Savings" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },
    {
      name: "Utilities",
      expense_categories: [
        ExpenseCategory.new({ name: "Electricity" }),
        ExpenseCategory.new({ name: "Gas" }),
        ExpenseCategory.new({ name: "Internet" }),
        ExpenseCategory.new({ name: "Phone" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },
    {
      name: "Transportation",
      expense_categories: [
        ExpenseCategory.new({ name: "Taxi & Car Service" }),
        ExpenseCategory.new({ name: "MTA & Transit" }),
        ExpenseCategory.new({ name: "Car Rental & Expenses" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Food",
      expense_categories: [
        ExpenseCategory.new({ name: "Restaurants & Dining" }),
        ExpenseCategory.new({ name: "Take Out" }),
        ExpenseCategory.new({ name: "Groceries" }),
        ExpenseCategory.new({ name: "Alcohol & Bars" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Gifts & Holidays",
      expense_categories: [
        ExpenseCategory.new({ name: "Gifts" }),
        ExpenseCategory.new({ name: "Donations" }),
        ExpenseCategory.new({ name: "Birthdays" }),
        ExpenseCategory.new({ name: "Celebrations" }),
        ExpenseCategory.new({ name: "Vacations" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Entertainment & Enrichment",
      expense_categories: [
        ExpenseCategory.new({ name: "Movies & Shows" }),
        ExpenseCategory.new({ name: "Subscriptions" }),
        ExpenseCategory.new({ name: "Hobbies" }),
        ExpenseCategory.new({ name: "Games" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Transfers & Reimburseables",
      expense_categories: [
        ExpenseCategory.new({ name: "CC Payments" }),
        ExpenseCategory.new({ name: "Transfers" }),
        ExpenseCategory.new({ name: "Reimburseable" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Household & QOL",
      expense_categories: [
        ExpenseCategory.new({ name: "Furniture" }),
        ExpenseCategory.new({ name: "Consumables" }),
        ExpenseCategory.new({ name: "Decor" }),
        ExpenseCategory.new({ name: "Tools & Appliances" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Personal Care",
      expense_categories: [
        ExpenseCategory.new({ name: "Hair & Body" }),
        ExpenseCategory.new({ name: "Clothing" }),
        ExpenseCategory.new({ name: "R & R" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Health & Fitness",
      expense_categories: [
        ExpenseCategory.new({ name: "Doctor" }),
        ExpenseCategory.new({ name: "Dentist" }),
        ExpenseCategory.new({ name: "Labs" }),
        ExpenseCategory.new({ name: "Fitness" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Insurance",
      expense_categories: [
        ExpenseCategory.new({ name: "Medical" }),
        ExpenseCategory.new({ name: "Life" }),
        ExpenseCategory.new({ name: "Property" }),
        ExpenseCategory.new({ name: "Auto" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
    {
      name: "Savings",
      expense_categories: [
        ExpenseCategory.new({ name: "Liquid" }),
        ExpenseCategory.new({ name: "Retirement" }),
        ExpenseCategory.new({ name: "other" }),
      ]
    },  
  ]
)