class Api::V1::TransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token
    
    def index
      render json: Transaction.all
    end
  
    def create
      transaction = Transaction.create(transaction_params)
      render json: transaction
    end
  
    def destroy
      transaction.destroy(params[:id])
    end
  
    def update
      transaction = Transaction.find(params[:id])
      transaction.update_attributes(transaction_params)
      render json: transaction
    end

    def import
      result = Transaction.import(params[:file].path)
      #puts result.to_s
      render :json => {count: result.count, status: :created}
    end

    def minmax
      min_date = Transaction.minimum(:date)
      max_date = Transaction.maximum(:date)
      render :json => { minDate: min_date, maxDate: max_date}
    end
  
    private
  
    def transaction_params
      params.require(:transaction).permit(:id, :date, :description,
                     :amount, :transaction_type, :account_name, :category)
    end
  end