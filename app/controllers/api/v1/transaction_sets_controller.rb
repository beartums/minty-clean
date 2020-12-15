module Api
  module V1
    class TransactionSetsController < ApplicationController

      def create
        transaction_set = logged_in_user.transaction_sets.create!(transaction_set_params)
        transaction_set.import_csv(params[:file].path, params[:overwrite], params[:auto_accounts])
        render json: serialize(logged_in_user.transaction_sets)
      rescue StandardError => e
        transaction_set.destroy if transaction_set && transaction_set.persisted?
        render json: { error: 'failed transaction set import', details: e.message }, status: 400
      end

      def index
        render json: serialize(logged_in_user.transaction_sets)
      end

      def show
        transaction_set =  logged_in_user.transaction_sets.find(params[:id])
        render json: serialize(transaction_set)
      end

      def update
        if params[:file]
          transaction_set = logged_in_user.transaction_sets.find(params[:id])
          transaction_set.import_csv(params[:file].path, params[:overwrite], params[:auto_accounts])
          render json: { result: 'success' }, status: 200
        else
          transaction_set = logged_in_user.transaction_sets.find(params[:id])
          transaction_set.update_attributes!(transaction_set_params)
          render json: { result: 'success' }, status: 200
        end

      rescue StandardError => e
        render json: { error: e.message}, status: 400

      end

      def destroy
        transaction_set = logged_in_user.transaction_sets.find(params[:id])
        transaction_set.destroy
        render json: {message: "success"}
      rescue 
        render json: {message: "failed"}, status: 405
      end

      private
          
        def transaction_set_params
          params.require(:transaction_set).permit(:name, :description, :ignore_before)
        end

        def serialize(transaction_sets)
          transaction_sets.as_json(methods: [
            :transactions_count, :accounts_count, :first_transaction_at, :last_transaction_at
          ])
        end
    end
  end
end