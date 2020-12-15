module Api
  module V1
        
    class AccountTypesController < ApplicationController

      def index
        render json: AccountType.all
      end

      def show
        render json: AccountType.find(params[:id])
      end

      def update
        account_type = AccountType.find(params[:id])
        account.update_attributes(account_type_params)
        render json: account_type
      end
      
      def create
        account_type = AccountType.create(account_types_params)
        render json: account_type
      end
        
      def delete
        account_type = AccountType.find(params[:id])
        account_type.destroy
        render json: {message: 'success'}
      end

      private

        def account_types_params
          params_require(:account_type).permit(:name)
        end

    end
  end
end