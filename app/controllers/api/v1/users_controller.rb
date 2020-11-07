module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authorized, only: [:create]

      # REGISTER
      def create
        # TODO: need to throttle new accounts
        user = User.create(user_params)
        if user.valid?
          user.request_email_confirmation
          token = encode_token({user_id: user.id})
          render json: {user_id: user.id, token: token}
        else
          render json: {error: "Invalid username or password", messages: user.errors.messages}, status: 400
        end
      end

      def update
        unless @user.id == params[:id].to_i
          render json: {error: "unauthorized"}, status: 403
          return
        end
        
        user = User.find(params[:id])
        if user.update(user_params)
          render json: user.as_json(except: [:password_digest])
        else
          render json: {error: 'invalid user data', messages: user.errors.messages}, status: 400
        end
      end

      def show
        render json: {status: 403} unless @user.id == params[:id].to_i
        
        # only the user cna shoe a user account (for now)
        user = User.find(params[:id])
        render json: user.as_json(except: [:password_digest])
      rescue ActiveRecord::RecordNotFound
        render json: {error: 'that user id does not exist'}, status: 404
      end

      # def index
      #   render json: {status: 403} unless logged_in_user.admin?
      #   render User.all.as_json(except: [:password_digest])
      # end

      # private

      def user_params
        params.permit(:username, :password, :password_confirmation, :current_password,
                      :email, :first_name, :last_name)

      end

    end
  end
end