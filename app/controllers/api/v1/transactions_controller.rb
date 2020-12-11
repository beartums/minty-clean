module Api
  module V1
    class TransactionsController < ApplicationController
      skip_before_action :verify_authenticity_token
        
        def index
          render json: Transaction.all
        end
      
        def create
          transaction = Transaction.create(transaction_params)
          render json: transaction
        end
      
        def destroy
          transaction = Transaction.find(params[:id])
          transaction.destroy
          render :json => {stuff: 'this is stuff'}
        end
      
        def update
          transaction = Transaction.find(params[:id])
          transaction.update_attributes(transaction_params)
          render json: transaction
        end

        def import
          result = user_transaction_set.import_csv(params[:file].path, params[:overwrite], params[:auto_accounts])
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
  end 
end 
