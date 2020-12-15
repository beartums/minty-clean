class ExpenseMapping < ApplicationRecord
  belongs_to :expense_category, optional: false
  belongs_to :transaction_set, optional: false

  scope :by_name, -> { order(:name) }
  default_scope { order(:created_at) }

  def matched_transactions
    transactions = self.transaction_set.transactions
    transactions = transactions.where('description LIKE ?', sqlize(self.description)) unless self.description.blank?
    transactions = transactions.where('original_description LIKE ?', sqlize(self.original_description)) unless self.original_description.blank?
    transactions = transactions.where('account LIKE ?', sqlize(self.account)) unless self.account.blank?
    transactions = transactions.where('category LIKE ?', sqlize(self.category)) unless self.category.blank?
    return transactions unless self.category.blank? && self.description.blank? && self.original_description.blank? && self.account.blank?

    transactions.where(id: nil)
  end

  def hit_count
    matched_transactions.count
  end

  private
    def sqlize(value)
      value.gsub('!*','{!star!}').gsub('\*','{!star!}')
           .gsub('!?','{!question!}').gsub('\?','{!question!}')
           .gsub('*','%')
           .gsub('?','_')
           .gsub('{!star!}','*')
           .gsub('{!question!}','?')
    end
end
