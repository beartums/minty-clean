class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, if: ->{request.format.json?}
  before_action :authorized

  def encode_token(payload)
    JWT.encode(payload, Settings::TOKEN_SECRET)
  end

  def encode_refresh_token(payload)
    JWT.encode(payload, Settings::REFRESH_SECRET)
  end

  def decode_refresh_token(token)
    JWT.decode(token, Settings::REFRESH_SECRET, true, algorithm: 'HS256')[0]
  rescue JWT::DecodeError
    nil
  end

  def auth_header
    # { Authorization: 'Bearer <token>' }
    request.headers['Authorization']
  end

  def decoded_token
    if auth_header
      token = auth_header.split(' ')[1]
      # header: { 'Authorization': 'Bearer <token>' }
      begin
        JWT.decode(token, Settings::TOKEN_SECRET, true, algorithm: 'HS256')
      rescue JWT::DecodeError => e
        nil
      end
    end
  end
  
  
  def logged_in_user
    payload = decoded_token
    if payload
      user_id = payload[0]['id']
      @user = User.find_by(id: user_id)
      @user
    end
  end

  def logged_in?
    !!logged_in_user
  end

  def authorized
    render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  end

end
