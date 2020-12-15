module Api
  module V1
    class ExpenseMappingsController < ApplicationController

    rescue_from StandardError, with: :default_error_handler

      def index
        render json: serialize(user_transaction_set.expense_mappings)
      end

      def show
        render json: serialize(user_transaction_set.expense_mappings.find(params[:id]))
      end

      def update
        expense_mapping = user_transaction_set.expense_mappings.find(params[:id])
        expense_mapping.update_attributes!(expense_mapping_params)
        render json: serialize(expense_mapping)
      end
      
      def create
        expense_mapping = user_transaction_set.expense_mappings.create!(expense_mapping_params)
        end
        
      def delete
        expense_mapping = user_transaction_set.expense_mappings.find(params[:id]).destroy!
        render json: {message: 'success'}
      end

      private

        def expense_mapping_params
          params_require(:expense_mapping)
            .permit(:description, :account, :category, :expense_category_id, :new_description)
        end

        def serialize(expense_mappings)
          expense_mappings.as_json(methods: [:hit_count], include: { expense_category: 
              { 
                only: [:name],
                methods: [:breadcrumb_name] 
              } 
            }
          )
        end

        def default_error_handler(e)
          hash = {}
          render json: { message: "logged in user is null", error: e.message }, status: 401 if logged_in_user.blank?
          render json: { message: "no default transaction set", error: e.message }, status: 405 if user_transaction_set.blank?
          render json: { message: "failed", error: e.message}, status:405

        end

    end
  end
end