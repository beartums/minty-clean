module Api
  module V1
    class CategoryGroupMembershipsController < ApplicationController
      def create
        cgm = CategoryGroupMembership.create!(category_group_membership_params)
        render json: cgm
      end

      def show
      end

      def update
        category_group_membership = CategoryGroupMembership.find(params[:id])
        category_group_membership = category_group_membership.update_attributes(category_group_membership_params)
        render json: category_group_membership
      end

      def destroy
      end

      def index
        render json: CategoryGroupMembership.all
      end

      private
        def category_group_membership_params
          params.require(:category_group_membership).permit(:id, :category, :category_group_id)
        end
    end
  end 
end 

