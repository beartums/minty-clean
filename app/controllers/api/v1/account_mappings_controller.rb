module Api
  module V1
    class AccountMappingsController < ApplicationController

      def index
        render json: serialize(user_transaction_set.account_mappings)
      end

      def show
        render json: serialize(
          user_transaction_set.account_mappings.find(params[:id])
        )
      end

      def update
        account_mapping = user_transaction_set.account_mappings.find(params[:id])
        account_mapping.update_attributes(account_mapping_params)
        render json: serialize(account_mapping)
      end
      
      def create
        render json: serialize(
          user_transaction_set.account_mappings.create(account_mapping_params)
        )
      end
        
      def destroy
        user_transaction_set.account_mappings.find(params[:id]).destroy
        render json: {message: 'success'}
      end

      private

        def account_mapping_params
          params.require(:account_mapping).permit(:inbound_string, :account_id)
        end

        def serialize(mappings)
          mappings.as_json(methods: [:hit_count], include: { account: { only: :name }})
        end

      
      end
    end
  end