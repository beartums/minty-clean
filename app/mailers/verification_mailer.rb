class VerificationMailer < ApplicationMailer
  default from: 'no-reply@griffithnet.com'
  def confirmation_email(user, confirmation_code)
    @user = user
    @confirmation_code = confirmation_code
    mail(to: user.email, subject: "Action Needed: please confirm your email")
  end

  def password_reset_email(user, reset_code)
    @user = user
    @code = reset_code
    mail(to: user.email, subject: "Your requested password reset from Minty")
  end

end
