require 'rails_helper'

RSpec.describe "Password", type: :request do
  context "when updating a password" do
    it "allows update with current password" do 
    end
    it "allows update with password-reset token" do
    end
    it "requires that password-reset token not be expired" do
    end
  end
  context "when requesting a password reset" do
    it "accepts username" do
    end
    it "accepts email" do
    end
    it "send reset email" do
    end
    it "generates and saves password-reset token" do
    end
  end
end
