class User < ApplicationRecord
  has_secure_password

  validate :username_has_no_at_sign, :email_has_at_sign 
  validates :username, uniqueness: true, presence: true
  validates :email, presence: true, uniqueness: true 
  validates :password_digest, presence: true

  before_save :guard_password
  before_update :guard_email_and_username
  after_commit :reset_password_inputs

  attr_accessor :current_password

  RESET_TIMEOUT = 60.minutes
  EMAIL_CONFIRMATION_TIMEOUT = 4.hours

  def request_password_reset
    recovery_pw = random_string(14)

    if update_attributes(reset_password_digest: tokenify(recovery_pw),
                        reset_password_created_at: Time.now)
      VerificationMailer.password_reset_email(self, recovery_pw).deliver_now
      return recovery_pw
    end
     
    false
  end

  def reset_password(reset_pw, new_pw, new_pw_confirmation = nil)
    return false if self.reset_password_created_at + RESET_TIMEOUT < Time.now
    return false unless decrypted(self.reset_password_digest) == reset_pw
    @current_password = reset_pw
    update_attributes(password: new_pw, reset_password_digest: nil, reset_password_created_at: nil)
  end

  def request_email_confirmation
    pw = random_string(12)
    update_attributes(email_confirmation_digest: tokenify(pw), 
                      email_confirmation_requested_at: Time.now,
                      email_confirmed_at: nil)
    VerificationMailer.confirmation_email(self, pw).deliver_now
    pw
  end

  def confirm_email(confirmation_password)
    return false if email_confirmation_requested_at + EMAIL_CONFIRMATION_TIMEOUT < Time.now
    return false unless BCrypt::Password.new(email_confirmation_digest) == confirmation_password
    update_attributes(email_confirmed_at: Time.now, email_confirmation_digest: nil)
  end

  private

    def tokenify(string)
      BCrypt::Password.create(string)
    end

    def random_string(length)
      chars = Array('a'..'z') + Array('A'..'Z') + Array(1..9) + '!#%^*$@_-/.~|=+'.split('')
      Array.new(length) { chars.sample(random: SecureRandom) }.join
    end

    def decrypted(string)
      BCrypt::Password.new(string)
    end

    def guard_password
      return unless password_digest_changed?
      return if password_digest_was.nil?
      unless decrypted(password_digest_was) == @current_password ||
        (reset_password_digest_was && decrypted(reset_password_digest_was) == @current_password)
        errors.add(:current_password, "must match saved password to change password")
        throw :abort
      end
    end

    def guard_email_and_username
      return unless email_changed? || username_changed?
      unless authenticate(@current_password)
        errors.add(:username, "cannot be changed without the correct current_password") if username_changed?
        errors.add(:email, "cannot be changed without the correct current_password") if email_changed?
        throw :abort
      end
    end

    def reset_password_inputs
      @current_password = nil
    end

    def username_has_no_at_sign
      return if username.nil?
      errors.add(:username, "cannot have '@'") if username.include?('@')
    end
    def email_has_at_sign
      return if email.nil?
      errors.add(:email, "must have '@'") unless email.include?('@')
    end
end