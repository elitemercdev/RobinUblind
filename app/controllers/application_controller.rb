class ApplicationController < ActionController::Base

  helper_method :current_user, :logged_in?
  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def login(user)
    session[:session_token] = user.reset_session_token
  end

  def logged_in?
    !!current_user
  end

  def logout
    current_user.reset_session_token
    session[:session_token] = nil
  end

  def require_logged_in
    unless current_user
      render json: ["no logged in"], status: 401
    end
  end

end
