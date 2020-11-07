require 'rails_helper'
require 'settings'

RSpec.describe "Users", type: :request do

  context "When creating a user" do

    it "creates a valid user" do
      ActionMailer::Base.deliveries = []
      expect {
        post "/api/v1/users", :params => {username: "test", password:"test", email: "test@example.com"}
      }.to change(User, :count).by(1)
      expect(ActionMailer::Base.deliveries.size).to eq(1)
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)).to include("user_id", "token")
    end

    it "rejects an invalid user" do
      User.create({username: "test", password:"test", email: "test@examople.com"})
      expect {
        post "/api/v1/users", :params => {username: "test", password:"test"}
      }.to_not change(User, :count)
      expect(response).to have_http_status(400)
      json = JSON.parse(response.body)
      expect(json).to include("error", "messages")
      expect(json["messages"].keys).to eq(["username","email"])
    end

    it "handles the full email confirmation cycle" do
      expect {
        post "/api/v1/users", :params => {username: "test", password:"test", email: "test@example.com"}
      }.to change(User, :count).by(1)
      user = User.last
      expect(ActionMailer::Base.deliveries.size).to eq(1)
      html = ActionMailer::Base.deliveries.first.html_part.body.to_s
      link = html.match(/href="(.*)"/).captures[0].gsub('amp;','')
      text = ActionMailer::Base.deliveries.first.text_part.body.to_s
      link2 = text.match(/(^http.*$)/).captures[0]
      expect(url_parts(link)).to eql(url_parts(link2))

      get link[/(\/api.*)$/]
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include("token")
      user.reload
      expect(user.email_confirmation_digest).to be_nil
    end

  end

  context "When updating a user" do
    let(:user) { User.create(username: 'test', password: 'test', email: 'test@example.com') }
    let(:user2) { User.create(username: 'test2', password: 'test', email: 'test2@example.com') }
    let(:token) { JWT.encode({ id: user.id }, 's3cr3t') }
    let(:headers) { { "Authorization": "Bearer #{token}" } }

    it "allows edits from the same user" do
      put "/api/v1/users/#{user.id}", :params => { first_name: 'test'}, :headers => headers
      expect(response).to have_http_status(200)
    end
    
    it "rejects an unauthorized user" do
      put "/api/v1/users/#{user.id}", :params => { first_name: 'test' }
      expect(response).to have_http_status(401)
    end

    it "rejects edits from any other regular user" do
      put "/api/v1/users/#{user2.id}", :params => { first_name: 'test'}, :headers => headers
      expect(response).to have_http_status(403)
    end

    xit "allows a different user if admin for the org or better" do
    end

    it "doesn't allow password changes" do
      put "/api/v1/users/#{user.id}", :params => { password: 'abcdef' }, :headers => headers
      expect(response).to have_http_status(400)
      user.reload
      expect(user.authenticate('abcdef')).to be_falsy
    end

    it "allows password changes, if current password is passed and correct" do
      put "/api/v1/users/#{user.id}", :params => { password: 'abcdef', current_password: 'test' }, :headers => headers
      expect(response).to have_http_status(200)
      user.reload
      expect(user.authenticate('abcdef')).to be_truthy
    end

    it "doesn't allow id changes" do    
      new_id = user.id + 1
      put "/api/v1/users/#{user.id}", :params => { id: new_id }, :headers => headers
      expect(response).to have_http_status(200)
      user.reload
      expect(user.id).not_to eq(new_id)
    end

    xit "sends an email after an update" do
    end

    xit "requires verification of email changes" do
    end

    xit "requires verification of username changes" do
    end
  end

  context "when showing a user" do
    xit "rejects an unauthorized requet" do
    end
    xit "rejects another user that is not admin" do
    end
    xit "allows a user to see their own details" do
    end
    xit "allows an admin to see a users details" do
    end
  end

  context "when getting a list of users" do
    xit "rejects non-admin requst" do
    end
    xit "rejects admin/different-org requst" do
    end
    xit "return active users" do
    end
    xit "returns all users, when requested" do
    end
  end    
end

def url_parts(url)
  splittable = url.gsub("?",'|**|').gsub('&','|**|')
  splittable.split('|**|')
end

