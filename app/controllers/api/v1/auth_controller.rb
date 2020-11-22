require 'settings'

module Api
  module V1
    class AuthController < ApplicationController
      before_action :authorized, only: [:auto_login]

      def login
        @user = User.find_by(username: params[:username])

        if @user && @user.authenticate(params[:password])
          render json: logged_in_payload(@user), status: 200
        else
          render json: {error: "Invalid username or password", messages: @user.errors.messages}, status: 401
        end
      end

      def confirm_email
        @user = User.find(params[:uid])
        @confirmation_code = params[:code]
        if @user.confirm_email(@confirmation_code)
          render json: logged_in_payload(@user, "Email confirmed!  You are logged in"), status: 200
        else
          render json: { error: "confirmation rejected" }, status: 401
        end
      end

      def request_password_reset
        user = User.find_by(username: params[:username]) || User.find_by(email: params[:username])
        user.try(:request_password_reset)
        render json: { msg: "An email has been sent to the username or email that you submitted" }, status: 200
      end

      def reset_password
        @user = User.find_by(username: params[:username])
        if @user.reset_password(params[:code], params[:password], params[:password_confirmation])
          render json: logged_in_payload(@user, "Password reset!  You are logged in"), status: 200
          redirect_to '/login'
        else
          render json: { error: "new password rejected" }, status: 401
        end
      end

      def refresh_mah_token
        payload = decode_refresh_token(params[:refresh_token])
        if payload
          user = User.find(payload['id'])
          render json: logged_in_payload(user, "Token Refreshed"), status: 200
        else
          render json: { error: "Rejected!" }, status: :unauthorized
        end
      end

      def auto_login
        render json: @user
      end

      private

      def user_params
        params.permit(:username, :password, :email)
      end

      def token(user)
        encode_token({ id: user.id, username: user.username, iss: 'MINTY', exp: (Time.now + Settings::TOKEN_TIMEOUT).to_i })
      end

      def refresh_token(user)
        encode_refresh_token({ id: user.id, username: user.username, iss: 'MINTY', exp: (Time.now + Settings::REFRESH_TOKEN_TIMEOUT).to_i })
      end
      
      def logged_in_payload(user, msg = 'You are logged in.')
        { msg: msg, username: user.username, token: token(user), refresh_token: refresh_token(user) }
      end

    end
  end
end