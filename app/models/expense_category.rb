class ExpenseCategory < ApplicationRecord
  belongs_to :expense_group, optional: false
  has_many :transactions, dependent: :nullify

  def breadcrumb_name
    "#{expense_group.name} | #{self.name}"
  end

  def transaction_count
    self.transactions.count
  end

end
