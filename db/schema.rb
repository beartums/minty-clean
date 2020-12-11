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

ActiveRecord::Schema.define(version: 2020_12_09_233048) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_balances", force: :cascade do |t|
    t.bigint "account_id"
    t.date "balance_date"
    t.decimal "balance", precision: 11, scale: 3
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_account_balances_on_account_id"
  end

  create_table "account_mappings", force: :cascade do |t|
    t.string "inbound_string"
    t.bigint "account_id"
    t.bigint "transaction_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_account_mappings_on_account_id"
    t.index ["transaction_set_id"], name: "index_account_mappings_on_transaction_set_id"
  end

  create_table "account_types", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.integer "account_type_id"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "transaction_set_id"
    t.index ["account_type_id"], name: "index_accounts_on_account_type_id"
    t.index ["transaction_set_id"], name: "index_accounts_on_transaction_set_id"
  end

  create_table "category_group_memberships", force: :cascade do |t|
    t.string "category"
    t.integer "category_group_id"
    t.integer "profile_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "transaction_set_id"
    t.index ["category"], name: "index_category_group_memberships_on_category"
    t.index ["category_group_id"], name: "index_category_group_memberships_on_category_group_id"
    t.index ["transaction_set_id"], name: "index_category_group_memberships_on_transaction_set_id"
  end

  create_table "category_groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "transaction_set_id"
    t.index ["transaction_set_id"], name: "index_category_groups_on_transaction_set_id"
  end

  create_table "expense_categories", force: :cascade do |t|
    t.string "name"
    t.bigint "expense_group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_group_id"], name: "index_expense_categories_on_expense_group_id"
  end

  create_table "expense_groups", force: :cascade do |t|
    t.string "name"
    t.integer "transaction_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["transaction_set_id"], name: "index_expense_groups_on_transaction_set_id"
  end

  create_table "expense_mappings", force: :cascade do |t|
    t.string "description"
    t.string "account"
    t.string "category"
    t.bigint "expense_category_id"
    t.bigint "transaction_set_id"
    t.string "new_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_category_id"], name: "index_expense_mappings_on_expense_category_id"
    t.index ["transaction_set_id"], name: "index_expense_mappings_on_transaction_set_id"
  end

  create_table "period_unit_tables", force: :cascade do |t|
    t.string "name"
    t.integer "period_length"
    t.string "unit_type"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.bigint "transaction_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["transaction_set_id"], name: "index_tags_on_transaction_set_id"
  end

  create_table "transaction_sets", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "period_start_day"
    t.date "ignore_before"
  end

  create_table "transaction_tag_memberships", force: :cascade do |t|
    t.bigint "transaction_id"
    t.bigint "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_transaction_tag_memberships_on_tag_id"
    t.index ["transaction_id"], name: "index_transaction_tag_memberships_on_transaction_id"
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
    t.string "sha1", limit: 40
    t.bigint "transaction_set_id"
    t.bigint "account_id"
    t.bigint "expense_category_id"
    t.integer "day"
    t.integer "month"
    t.integer "year"
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["date", "amount", "transaction_type"], name: "index_transactions_on_date_and_amount_and_transaction_type"
    t.index ["date"], name: "index_transactions_on_date"
    t.index ["expense_category_id"], name: "index_transactions_on_expense_category_id"
    t.index ["transaction_set_id"], name: "index_transactions_on_transaction_set_id"
  end

  create_table "user_configs", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "default_transaction_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_configs_on_user_id"
  end

  create_table "user_transaction_set_memberships", force: :cascade do |t|
    t.bigint "transaction_set_id"
    t.bigint "user_id"
    t.boolean "is_owner"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "period_start_day"
    t.index ["transaction_set_id"], name: "index_user_transaction_set_memberships_on_transaction_set_id"
    t.index ["user_id"], name: "index_user_transaction_set_memberships_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "last_name"
    t.string "first_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin"
    t.string "reset_password_digest"
    t.datetime "reset_password_created_at"
    t.datetime "email_confirmation_requested_at"
    t.datetime "email_confirmed_at"
    t.text "email_confirmation_digest"
  end

  add_foreign_key "account_balances", "accounts"
  add_foreign_key "account_mappings", "accounts"
  add_foreign_key "account_mappings", "transaction_sets"
  add_foreign_key "accounts", "account_types"
  add_foreign_key "accounts", "transaction_sets"
  add_foreign_key "category_group_memberships", "transaction_sets"
  add_foreign_key "category_groups", "transaction_sets"
  add_foreign_key "expense_categories", "expense_groups"
  add_foreign_key "expense_groups", "transaction_sets"
  add_foreign_key "expense_mappings", "expense_categories"
  add_foreign_key "expense_mappings", "transaction_sets"
  add_foreign_key "tags", "transaction_sets"
  add_foreign_key "transaction_tag_memberships", "tags"
  add_foreign_key "transaction_tag_memberships", "transactions"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "expense_categories"
  add_foreign_key "transactions", "transaction_sets"
  add_foreign_key "user_configs", "users"
  add_foreign_key "user_transaction_set_memberships", "transaction_sets"
  add_foreign_key "user_transaction_set_memberships", "users"
end
