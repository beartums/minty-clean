import React from 'react';
import TransactionSummaryRow from './TransactionSummaryRow';
import TransactionSummaryHeader from './TransactionSummaryHeader';
import { FaChevronLeft, FaChevronRight, FaBackward, FaForward, FaStepBackward, FaStepForward } from 'react-icons/fa';
import * as numeral from 'numeral';
import Period from '../models/Period';
import { Settings, KEYS } from '../services/settings';

class TransactionSummaryTable extends React.Component {
  constructor(props) {
    super(props);
    let currentPeriod;
    currentPeriod = Settings.get(KEYS.PERIODS.FIRST_PERIOD).getOffsetPeriod(0);
    let firstPeriod = this.getExtremePeriod('min', currentPeriod);
    let lastPeriod = this.getExtremePeriod('max', currentPeriod);

    let sd = currentPeriod.startDate;
    let count = Settings.get(KEYS.DISPLAY.PERIOD_COUNT);
    let lastPeriodShown = new Period(sd,
      count-1,
      currentPeriod.rangeType,
      currentPeriod.rangeCount);

    this.state = {
      SETTINGS: {
        START_DATE: Settings.get(KEYS.PERIODS.FIRST_PERIOD).startDate,
        PERIOD_RANGE_TYPE: Settings.get(KEYS.PERIODS.RANGE_TYPE),
        PERIOD_RANGE_COUNT: Settings.get(KEYS.PERIODS.RANGE_LENGTH),
        PERIOD_COUNT: Settings.get(KEYS.DISPLAY.PERIOD_COUNT),
      },
      periodsBeforeFirst: Period.getPeriodDiff(firstPeriod, currentPeriod),
      periodsAfterLast: Period.getPeriodDiff(lastPeriodShown, lastPeriod),
      firstPeriod: firstPeriod,
      lastPeriod: lastPeriod,
      currentPeriod: currentPeriod,
      groupSummaries: Settings.get(KEYS.GROUPS.TO_SUM,{}),
      periods: Period.organizeTransactionsIntoPeriods(null,this.props.transactions,firstPeriod)
    }

  }

  setPeriodRelativeCounts = (period) => {
    let lastShownPeriod = this.getLastShownPeriod(period);
    this.setState({
      periodsBeforeFirst: Period.getPeriodDiff(this.state.firstPeriod, period),
      periodsAfterLast: Period.getPeriodDiff(lastShownPeriod, this.state.lastPeriod),
      currentPeriod: period
    });
  }

  getLastShownPeriod = (firstShownPeriod) => {
    let period = new Period(firstShownPeriod.startDate,
                          this.state.SETTINGS.PERIOD_COUNT-1,
                          firstShownPeriod.rangeType,
                          firstShownPeriod.rangeCount);
    return period;
  }

  changeStartDate = (delta) => {
    let periodOffset = 0;
    let period;
    if (delta === Number.MAX_SAFE_INTEGER) {
      period = this.state.lastPeriod;
      period = period.getOffsetPeriod(-1 * Settings.get(KEYS.DISPLAY.PERIOD_COUNT) + 1);
    } else if (delta === Number.MIN_SAFE_INTEGER) {
      period = this.state.firstPeriod;
    } else {
      period = this.state.currentPeriod;
      period = period.getOffsetPeriod(delta);
    }
    this.setPeriodRelativeCounts(period);
  }

  getExtremePeriod = (minmax, currentPeriod) => {
    if (!this.props.minDate) return;
    currentPeriod = currentPeriod || this.state.currentPeriod;
    let minmaxDate = this.props[`${minmax}Date`];
    let period = currentPeriod.getRelativePeriod(minmaxDate);
    return period;
  }

  periodsAfterLast = () => {
    return this.state.periodsAfterLast;
  }
  periodsBeforeFirst = () => {
    return this.state.periodsBeforeFirst;
  }

  toggleSummarized = (group) => {
    let summaries = this.state.groupSummaries;
    summaries[group.name] = !summaries[group.name]
    this.setState({
     groupSummaries: summaries
    });
    Settings.set(KEYS.GROUPS.TO_SUM, summaries);
  }

  getCategoriesToSum = () => {
    let groupNames = Object.keys(this.state.groupSummaries).filter(name=>this.state.groupSummaries[name]);
    let groups = this.props.groups.filter(group => groupNames.indexOf(group.name) > -1);
    let categories = groups.reduce( (cats,group) => cats.concat(group.categories), []);
    //let categories = []
    return categories;
  }

  getPeriodsToShow = () => {
    let periods = this.state.periods;
    let keys = Object.keys(periods).sort();
    let idx = keys.indexOf(this.state.currentPeriod.startDate.toISOString())
    let periodsToShow = [];
    for (let i = idx; i < idx + this.state.SETTINGS.PERIOD_COUNT; i++) {
      periodsToShow.push(periods[keys[i]]);
    }
    return periodsToShow;
  }

  render() {
    let periods = this.getPeriodsToShow();
    let numPeriodsToShow = this.state.SETTINGS.PERIOD_COUNT;
    let catsToSummarize = this.getCategoriesToSum();

    return(
      <div class-name="row">
        <div className="col-12">

          <div className="row">
            <div className="col-6">
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() === 0}
                      title='Step backward one period'
                      onClick={() => this.changeStartDate(-1)}>
                      <FaChevronLeft />
                </button>
                &nbsp;
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() < numPeriodsToShow}
                      title='Jump backward one page'
                      onClick={() => this.changeStartDate(-1*numPeriodsToShow)}>
                      <FaBackward />
                </button>
                &nbsp; 
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() === 0}
                      title='Go to the oldest period'
                      onClick={() => this.changeStartDate(Number.MIN_SAFE_INTEGER)}>
                      <FaStepBackward />
                </button>
            </div>
            <div className="col-6 text-right">
                <button className="btn btn-sm" disabled={this.periodsAfterLast() === 0} 
                      title='Go to the newest period'
                      onClick={() => this.changeStartDate(Number.MAX_SAFE_INTEGER)}>
                  <FaStepForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.periodsAfterLast()<3}
                      title='Jump forward one page'
                      onClick={() => this.changeStartDate(numPeriodsToShow)}>
                  <FaForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.periodsAfterLast() === 0} 
                      title='Step forward one period'
                      onClick={() => this.changeStartDate(1)}>
                  <FaChevronRight />
                </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table width="100%" className="table table-condensed table-xs">
                <TransactionSummaryHeader periods={periods} />
                <tbody>
                  { this.props.groups.map(group => {
                    return <TransactionSummaryRow key={group.id} 
                    group={group} 
                    periods={periods}
                    isSummarized={this.state.groupSummaries[group.name]}
                    showTransactions={this.props.showTransactions} 
                    hideTransactions={this.props.hideTransactions}
                    toggleSummarized={this.toggleSummarized} />
                  })}
                  <tr>
                    <td colSpan="2"></td>
                    { periods.map( (period,idx) => { return ( 
                        <td key={idx} className="text-right">
                          <strong>
                            {numeral(period.getCategorySums(catsToSummarize)).format('$0.00')}
                          </strong>
                        </td>  
                      )}
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )

  }
}

export default TransactionSummaryTable;