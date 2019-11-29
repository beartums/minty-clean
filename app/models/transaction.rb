require 'csv';

class Transaction < ApplicationRecord

  def getSignedAmount
    return amount * (transaction_type == "debit" ? -1 : 1)
  end

  def self.import(file)
    rows = CSV.read(file, headers:true)
    rows = Transaction.getNewTransactions(rows)

    #import a CSV file, using a DB transaction
    ActiveRecord::Base.transaction do
      rows.reverse_each do |row|
        Transaction.create(
          date: Time.strptime(row["Date"],"%m/%d/%Y"),
          description: row["Description"],
          original_description: row["Original Description"],
          transaction_type: row["Transaction Type"],
          account_name: row["Account Name"],
          amount: row["Amount"],
          category: row["Category"],
          labels: row["Labels"],
          notes: row["Notes"]
        )
     end
    end
    return { success: true, count: rows.length, status: :created }
  end

  def self.getNewTransactions(rows)
    # ONLY works if rows file has ALL the transactions in it
    transactions = Transaction.all
    if transactions.length > rows.length
      throw "Bad Transaction file!  Not enough rows"
    end
    rows.take(rows.length-transactions.length)
  end

end
