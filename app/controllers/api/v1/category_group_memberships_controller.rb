class Api::V1::CategoryGroupMembershipsController < ApplicationController
  def create
    cgm = CategoryGroupMembership.create!(category_group_membership_params)
    render json: cgm
  end

  def show
  end

  def update
    category_group_membership = CategoryGroupMembership.find(category: params[:category])
    category_group_membership = CategoryGroupMembership.update_atttributes(category_group_membership_params)
    render json: category_group_membership
  end

  def destroy
  end

  def index
    render json: CategoryGroupMembership.all
  end

  private
    def category_group_membership_params
      params.require(:category_group_membership).permit(:category, :category_group_id)
    end
end
