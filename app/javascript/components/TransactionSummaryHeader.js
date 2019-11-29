import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

class TransactionSummaryHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  getPeriodTitle(period) {
    return `${moment(period.startDate).format('D MMM')} to ${moment(period.endDate).format('D MMM')}`
  }

  render() {
    let years = [];
    let previousPeriod = null;
    this.props.periods.forEach( period => {
      let year = period.startDate.getFullYear();
      if (!previousPeriod || year != previousPeriod.startDate.getFullYear()) {
        years.push({year: year, months: []})
      }
      previousPeriod = period;
      years[years.length-1].months.push(period);
      
    })
    return (
      <thead>
        <tr className='xs'>
          <th className="text-right xs" rowSpan="2" colSpan="2"></th>
          { years.map((year,idx) => {
            return <th key={idx} colSpan={year.months.length} className="text-center xs">{year.year}</th>
          })}
        </tr>
        <tr className="xs">
          {this.props.periods.map( (period, idx) => {
            return (
              <th key={idx} className="text-center xs" title={this.getPeriodTitle(period)}>
                {MONTHS[period.startDate.getMonth()]}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }
}

TransactionSummaryHeader.propTypes = {
  periods: PropTypes
    .arrayOf(PropTypes.shape({
      startDate: PropTypes.date,
      endDate: PropTypes.date
    })).isRequired
}

export default TransactionSummaryHeader;