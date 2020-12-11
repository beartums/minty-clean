class TransactionSummarizer

  class SummarizerError < StandardError; end

  def initialize(transaction_set_id: , period_start_day:, months_in_period: 1, summarize_by: 'category', start_period: nil, start_year: nil, num_periods: nil, filters: {})
    @transaction_set_id = transaction_set_id
    @period_start_day = period_start_day
    @months_in_period = months_in_period
    @summarize_by = summarize_by
    @start_period = start_period
    @start_year = start_year
    @num_periods = num_periods
    @filters = filters # "category": "name"
  end

  def run
    ActiveRecord::Base.connection.execute(sql)
  end
  
  def sql
    <<~SQL
      WITH period_trans AS (
        SELECT id,
                date,
                CASE 
                  WHEN DATE_PART('day', date) > #{@period_start_day - 1 } 
                  THEN DATE_PART('month', date) 
                  ELSE 
                    CASE 
                      WHEN DATE_PART('month', date) = 1
                      THEN 12
                      ELSE DATE_PART('month', date) - 1 
                    END
                END period,
                CASE 
                  WHEN DATE_PART('day', date) < #{@period_start_day} AND DATE_PART('month',date) = 1 
                  THEN -1 
                  ELSE 0 
                END + date_part('year', date) "year",
                amount,
                category,
                (SELECT cg.name FROM category_groups cg 
                                JOIN category_group_memberships cgm 
                                ON cgm.category = t.category 
                                AND cgm.category_group_id = cg.id
                                AND cgm.transaction_set_id = t.transaction_set_id) category_group,
                (SELECT ec.name FROM expense_categories ec 
                                WHERE ec.id = t.expense_category_id) expense_category,
                (SELECT eg.name FROM expense_groups eg
                                JOIN expense_categories ec
                                ON ec.id = t.expense_category_id
                                AND eg.transaction_set_id = t.transaction_set_id
                                AND eg.id = ec.expense_group_id) expense_group
        FROM transactions t
        WHERE t.transaction_set_id = #{@transaction_set_id}
        #{where_sql}
      )
      #{summarize_by_sql}
    SQL
  end

  def summarize_by_sql(summary_field = nil)
    summary_field ||= @summarize_by
    
    if summary_field == 'transaction'
      <<~SQL
        SELECT date, #{period_sql} period, "year", amount, category, category_group, expense_category, expense_group FROM period_trans
        ORDER BY "year", #{period_sql}, date
      SQL
    else
      <<~SQL
        SELECT "year", #{period_sql} period, #{summary_field}, sum(amount) amount, COUNT(*) count
        FROM period_trans
        GROUP BY "year", #{period_sql}, #{summary_field}
        ORDER BY "year", #{period_sql}, #{summary_field}
      SQL
    end
  end

  def period_sql
    if @months_in_period == 1
      "period"
    else
      <<~SQL
        ( 
          FLOOR( 
            (period - 1) / CAST(#{12/@months_in_period} AS DOUBLE PRECISION)
          ) + 1 
        )
      SQL
    end
  end

  def where_sql
    wheres = []
    wheres << "date >= '#{date_from_period_and_year(@start_period, @start_year)}'" unless @start_period.blank? || @start_year.blank?
    wheres << "date < '#{date_from_period_and_year(@start_period, @start_year, @num_periods)}'" unless @start_period.blank? || @start_year.blank? || @num_periods.blank?
    @filters.each { |field, value| wheres << "#{field} = '#{value}'" }

    " AND #{wheres.join(' AND ')}" unless wheres.blank? 
  end

  def date_from_period_and_year(period, year, period_offset = 0, months_in_period = nil, start_day = nil)
    months_in_period ||= @months_in_period
    start_day ||= @period_start_day

    raise SummarizerError.new("Bad argument: specified period disallowed by months_in_period (#{period} > 12 / #{months_in_period}") if period > 12/months_in_period

    periods_in_year = 12/months_in_period

    years = ((period + period_offset)/(periods_in_year)).floor

    final_period = (period + period_offset) % periods_in_year
    final_year = year + years
    month = (final_period - 1) * months_in_period + 1

    "#{month}/#{start_day}/#{final_year}"
  end



end