require 'rails_helper'

RSpec.describe User, type: :model do
  context "when creating a user" do

    it "validates required fields" do
      user = User.create(username: "username", password: "password", email: "email@examplecom")
      expect(user.valid?).to be true
    end

    it "fails without username"  do
      user = User.create(password: "password", email: "email@example.com")
      expect(user.valid?).to be false
      expect(user.errors[:username].size).to eq(1)
    end
    it "fails without email"  do
      user = User.create(username: "username", password: "password")
      expect(user.valid?).to be false
      expect(user.errors[:email].size).to eq(1)
    end
    it "checks password_confirmation, if passed" do
      user = User.create(username: "username", password: "password", email: "email@example.com", password_confirmation: "password")
      expect(user.valid?).to be true
      user = User.create(username: "username", password: "password", email: "email@example.com", password_confirmation: "pass")
      expect(user.valid?).to be false
    end

    it "authenticates" do
      user = User.create(username: "username", password: "password", email: "email@example.com")
      expect(user.authenticate("password")).to be_truthy
    end

    it "rejects bad password" do
      user = User.create(username: "username", password: "password", email: "email@example.com")
      expect(user.authenticate("pass")).to be false
    end

  end

  context "when resetting the password" do
    let(:user) { User.create(username:'test', password: 'test', email: 'test@example.com') }
    
    it "generates a recovery password" do
      pw = user.request_password_reset
      expect(BCrypt::Password.new(user.reset_password_digest) == pw).to be_truthy
    end

    it "resets the password" do
      pw = user.request_password_reset
      expect(user.reset_password(pw, 'new password')).to be_truthy
      expect(user.authenticate('new password')).to be_truthy
    end

    it "validates the password reset" do
      pw = user.request_password_reset
      expect(user.reset_password('wrong_password', 'new password')).to be_falsey
      expect(user.authenticate('new password')).to be_falsey
    end

    it "requires the reset password to not be expired" do
      pw = user.request_password_reset
      user.reset_password_created_at = Time.now - 120.minutes
      expect(user.reset_password(pw, 'new password')).to be_falsey
      expect(user.authenticate('new password')).to be_falsey
    end

  end

  context "when changing the password" do
    let(:user) { User.create(username:'test', password: 'test', email: 'test@example.com') }

    it "doesn't update the password without the current password" do
      expect(user.update_attributes(password:'new_password')).to be(false)
      expect(user.authenticate('new password')).to be(false)
    end

    it "updates the password if the current password is specified" do
      expect(user.update_attributes(password:'new_password',current_password:'test')).to be(true)
      expect(user.authenticate('new_password')).to be_truthy
    end

  end

  context "when updating the user" do
    let(:user) { User.create(username:'test', password: 'test', email: 'test@example.com') }
    let(:user2) { User.create(username:'test2', password: 'test2', email: 'test2@example.com') }
    
    context "when changing the user name" do

      it "prevents usernames with '@'" do
        expect(user.update_attributes(username: 'test@home.com', current_password: 'test')).to be(false)
      end

      it "prevents duplicate usernames" do\
        new_user = user2
        expect(user.update_attributes(username: 'test2', current_password: 'test')).to be(false)
      end

      it "prevents username update without password" do
        expect(user.update_attributes(username: 'testme')).to be(false)
      end

      it "prevents username updates without CORRECT password" do
        expect(user.update_attributes(username: 'testme', current_password: 'wrong')).to be(false)
      end

      it "allows username updates otherwise" do
        expect(user.update_attributes(username: 'testme', current_password: 'test')).to be(true)
      end
    end
  end
end
