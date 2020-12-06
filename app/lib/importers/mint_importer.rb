# module importers
#   class MintImporter

#     def initialize(rows, transaction_set, user)
#       @transaction_set = transaction_set
#       @user = user
#       @rows = rows
#     end

#     def self.import(rows, transaction_set_id)
#       importer = MintImporter.new(rows, transaction_set)
#       importer.call
#     end

#     def call
#       @old_rows = @transaction_set.
#                   transactions.include(:account).
#                   order("date", "amount", "transaction_type", "accounts.name")
#       @new_rows = @rows.sort_by { |row| [ row['date'], row['amount'], row["transaction_type"] ] }

#       diff = diff(@old_rows, @new_rows)

#       new_mappings = new_account_mappings(diff['new_orphans'])
#       add_rows(diff['new_orphans'])

#     end

#     private

#       def diff(a1, a2)
#         old_orphans = []
#         new_orphans = []

#         enum1 = a1.each
#         enum2 = a2.each

#         val1 = next(enum1)
#         val2 = next(enum2)

#         until val1.blank? && val2.blank?
#           if val1.blank? || gt(val1, val2)
#             new_orphans << val2
#             val2 = next(enum2)
#           elsif val2.blank? || lt(val1, val2)
#             old_orphans << val1
#             val1 = next(enum1)
#           elsif equal(val1, val2)
#             val1 = next(enum1)
#             val2 = next(enum2)
#           else
#             raise StandardError.new("MintImporter#diff: not LT, GT, ==, or blank?  Should not be here")
#           end
#         end

#         {
#           old_orphans: old_orphans,
#           new_orphans: new_orphans
#         }
       
#       end

#       def next(enum)
#         enum.next
#       rescue StopIteration
#         nil
#       end
      
#       def equal(v1, v2)
#         v1.date.to_s == v2['date'] && 
#           v1.amount == v2['amount'] && 
#           v1.transaction_type == v2['transaction_type']
#       end

#       def gt(v1, v2)
#         (v1.date.to_s > v2['date']) ||
#         (v1.date.to_s == v2['date'] && v1.amount > v2['amount']) ||
#         (v1.date.to_s == v2['date'] && v1.amount == v2['amount'] && v1.transaction_type > v2['transaction_type'])
#       end

#       def lt(v1, v2)
#         (v1.date.to_s < v2['date']) ||
#         (v1.date.to_s == v2['date'] && v1.amount < v2['amount']) ||
#         (v1.date.to_s == v2['date'] && v1.amount == v2['amount'] && v1.transaction_type < v2['transaction_type'])
#       end

#       def incoming_account_mappings(rows = nil)
#         row =|| @rows
#         account_names = @rows.uniq { |row| row[:account_name] }.pluck(:account_name)
#         mappings = account_names.map do |name|
#           mapping = @transaction_set.account_mappings.find_by(inbound_string: name)
#           [ name, mapping.try(:account_id) ]
#         end
#         mappings.to_h
#       end

#       def unmapped_account_names(mappings = nil)
#         mappings =|| incoming_account_mappings
#         unmapped = mappings.select { |_k, v| v.blank? }
#         mappings.map { |k, _v| k }
#       end

#       def import_rows(rows = nil)
#         rows ||= @rows
#         columns = %i(description account_name amount transaction_type labels notes 
#                     original_description category date user_id transaction_set_id import_batch_id )
#         batch = ImportBatch.create(user: @user, transaction_set: @transaction_set)
#         added_keys = { batch_id: batch.id, user_id: @user.id, transaction_set_id: @trasnaction_set.id}

#         @rows = rows.map {|row| row.merge(added_keys)}

#         Import.import columns, @rows
#       end

#   end
# end