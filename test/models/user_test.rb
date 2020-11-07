require 'test_helper'

class UserTest < ActiveSupport::TestCase

  setup do
    @user = User.new(username:'username', email: 'email', password: 'password', password_confirmation: 'password')
  end

  test "Valid User" do
    user = User.new(username:'eric', password:'passwrod', email: 'eric@example.com')
    assert user.valid?
  end

  test "invalid without username" do
    user = User.new(password:'passwrod', email: 'email')
    refute user.valid?
    assert_not_nil user.errors[:username]
  end

  test "invalid without password" do
    user = User.new(username:'username', email: 'email')
    refute user.valid?
    assert_not_nil user.errors[:password]
  end

  test "matches password confirmation if passed" do
    user = User.new(username:'username', email: 'email', password: 'password', password_confirmation: 'passw')
    refute user.valid?
    assert_not_nil user.errors[:password]
    assert @user.valid?
  end

  test "authenticates" do
    user = User.new(username:'username', email: 'email', password: 'password', password_confirmation: 'password')
    assert user.authenticate('password')
  end

  test "rejects bad password" do
    user = User.new(username:'username', email: 'email', password: 'password', password_confirmation: 'password')
    refute user.authenticate('pass')
  end
end
