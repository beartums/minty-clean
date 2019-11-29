# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_18_033702) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "category_group_memberships", force: :cascade do |t|
    t.string "category"
    t.integer "category_group_id"
    t.integer "profile_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_category_group_memberships_on_category"
    t.index ["category_group_id"], name: "index_category_group_memberships_on_category_group_id"
  end

  create_table "category_groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.date "date"
    t.string "description"
    t.string "original_description"
    t.float "amount"
    t.string "transaction_type"
    t.string "category"
    t.string "account_name"
    t.string "labels"
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date", "amount", "transaction_type"], name: "index_transactions_on_date_and_amount_and_transaction_type"
    t.index ["date"], name: "index_transactions_on_date"
  end

end
