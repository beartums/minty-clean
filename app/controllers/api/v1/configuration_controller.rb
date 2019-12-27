module Api
  module V1
    class ConfigurationsController < ApplicationController
      skip_before_action :verify_authenticity_token
        
      def index
        render json: Configuration.all
      end
    
      def create
        configuration = Configuration.create(configuration_params)
        render json: configuration
      end
    
      def destroy
        configuration.destroy(params[:id])
      end
    
      def update
        configuration = Configuration.find(params[:id])
        configuration.update_attributes(configuration_params)
        render json: configuration
      end

      def show
        configuration = Configuration.find(params[:id]).to_json(include: {category_group: {include: :category_group_membership}})
        render json: configuration
      end
    
      private
    
      def configuration_params
        params.require(:configuration).permit(:id, :name, :description)
      end
    end
  end 
end 
