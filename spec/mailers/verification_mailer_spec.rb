require "rails_helper"

RSpec.describe VerificationMailer, type: :mailer do
  
  context "#confirmation_email" do

    let(:user) { User.create(username: 'test', password: 'test', email: 'test@example.com')}
    let(:code) { '123wer234'}
    let(:mail) { described_class.confirmation_email(user, code) }

    it "generates a confirmation email" do 
      expect(mail.subject).to match("confirm").and match('email')
      expect(mail.to).to include(user.email)
    end

    it "renders the confirmation code in html" do
      expect(mail.html_part.body.encoded).to match(code)
    end

    it "renders the confirmation code in text" do
      expect(mail.text_part.body.encoded).to match(code)
    end

  end

  context "#password_reset_email" do

    let(:user) { User.create(username: 'test', password: 'test', email: 'test@example.com')}
    let(:code) { '123wer234'}
    let(:mail) { described_class.password_reset_email(user, code) }

    it "generates a password reset email" do 
      expect(mail.subject).to match("password reset").and match('Minty')
      expect(mail.to).to include(user.email)
    end

    it "renders the confirmation code in html" do
      expect(mail.html_part.body.encoded).to match(code)
    end

    it "renders the confirmation code in text" do
      expect(mail.text_part.body.encoded).to match(code)
    end

  end
end
