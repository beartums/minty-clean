module Api
  module V1
        
    class AccountsController < ApplicationController
  
      def index
        render json: user_transaction_set.accounts
      end

      def show
        render json: user_transaction_set.accounts.find(params[:id])
      end

      def update
        account = user_transaction_set.accounts.find(params[:id])
        account.update_attributes(account_params)
        render json: account
      end
      
      def create
        account = user_transaction_set.accounts.create(account_params)
        render json: account
      end
        
      def destroy
        account = user_transaction_set.accounts.find(params[:id])
        account.destroy!
        render json: { message: 'success' }
      rescue
        render json: { message: "failed" }
      end

      private

        def account_params
          params.require(:account).permit(:name, :description, :account_type_id)
        end

    end
  end
end
