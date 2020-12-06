require 'csv';

class Transaction < ApplicationRecord
  belongs_to :transaction_set, optional: true
  belongs_to :account
  has_many :transaction_tag_memberships
  has_many :tags, through: :transaction_tag_memberships

  validates :date, presence: true
  validates :transaction_type, presence: true, inclusion: %w(debit credit)
  validates :amount, presence: true, numericality: true
  validates :account, presence: true
  validate  :date_is_a_date

  def getSignedAmount
    signed_amount
  end

  def signed_amount
    return amount * (transaction_type == "debit" ? -1 : 1)
  end

  def set_tags(tag_names)
    self.tags = tag_names.map {|name| transaction_set.tags.find_or_initialize_by(name: name) }
    save!
  end

  def date_is_a_date
    return if date.is_a?(Date) || date.is_a?(Time)
    errors.add(:date, "date must be valid date or time value")
  end

  def all_text
    "#{date.to_s} #{original_description} #{amount.to_s} #{transaction_type} #{account_name} #{notes} #{labels} #{category}"
  end

end
