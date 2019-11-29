class Api::V1::CategoryGroupsController < ApplicationController
  def create
    begin
      category_group = CategoryGroup.create!(category_group_params)
    rescue StandardError => e
      puts "error #{e}"
      render :json => e, :status => 400 
    else
      render json: category_group
    end
  end

  def update
    category_group = CategoryGroup.find(params[:id])
    category_group.update_attributes(category_group_params)
    render json: category_group
  end

  def destroy
    CategoryGroup.destroy(params[:id])
    render json: {status: '200'}, status:200
  end

  def index
    render json: CategoryGroup.all
  end

  private 
    def category_group_params
      params.require(:category_group).permit(:name)
    end 
end
