/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  FaChevronLeft, FaChevronRight, FaBackward, FaForward, FaStepBackward, FaStepForward,
} from 'react-icons/fa';
import * as numeral from 'numeral';
import TransactionSummaryRow from './TransactionSummaryRow';
import TransactionSummaryHeader from './TransactionSummaryHeader';
import { Settings, KEYS } from '../services/settings';

class TransactionSummaryTable extends React.Component {
  constructor(props) {
    super(props);
    const currPeriod = Settings.get(KEYS.DISPLAY.FIRST_PERIOD);
    const curIndex = this.getPeriodIndex(
      currPeriod,
      this.props.periods,
    );
    this.state = {
      groupSummaries: Settings.get(KEYS.GROUPS.TO_SUM),
      periodsAfterLast: this.getPeriodsAfterLastCalc(
        this.props.periods,
        curIndex,
        Settings.get(KEYS.DISPLAY.PERIOD_COUNT),
      ),
      periodsBeforeFirst: curIndex,
    };
  }

  getPeriodIndex = (period, periods) => {
    for (let i = 0; i < periods.length; i++) {
      if (period.startDate === periods[i].startDate.toISOString()) return i;
    }
    return 0;
  }

  setFirstPeriod = (delta) => {
    const { periods } = this.props;
    const firstPeriod = Settings.get(KEYS.DISPLAY.FIRST_PERIOD);
    const numToShow = Settings.get(KEYS.DISPLAY.PERIOD_COUNT);
    const curIdx = this.getPeriodIndex(firstPeriod, periods);

    let idx;
    if (delta === Number.MAX_SAFE_INTEGER) {
      idx = periods.length - numToShow < 0 ? 0 : periods.length - numToShow;
    } else if (delta === Number.MIN_SAFE_INTEGER) {
      idx = 0;
    } else {
      idx = curIdx + delta;
      idx = idx < 0 ? 0 : idx;
      idx = idx >= periods.length ? periods.length - 1 : idx;
    }
    const period = periods[idx];

    Settings.set(KEYS.DISPLAY.FIRST_PERIOD, period);
    this.setState({
      periodsAfterLast: this.getPeriodsAfterLastCalc(periods, idx, numToShow),
      periodsBeforeFirst: idx,
    });
  }

  getPeriodsAfterLastCalc(periods, idx, numToShow) {
    return periods.length - (idx + numToShow) < 0
      ? 0
      : periods.length - (idx + numToShow);
  }

  periodsAfterLast = () => this.state.periodsAfterLast

  periodsBeforeFirst = () => this.state.periodsBeforeFirst

  toggleSummarized = (group) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const summaries = this.state.groupSummaries;
    summaries[group.name] = !summaries[group.name];
    this.setState({
      groupSummaries: summaries,
    });
    Settings.set(KEYS.GROUPS.TO_SUM, summaries);
  }

  getCategoriesToSum = () => {
    const groupNames = Object.keys(this.state.groupSummaries)
      .filter((name) => this.state.groupSummaries[name]);
    const groups = this.props.groups.filter((group) => groupNames.indexOf(group.name) > -1);
    const categories = groups.reduce((cats, group) => cats.concat(group.categories), []);
    return categories;
  }

  getPeriodsToShow = (periods, firstPeriod, numToShow) => {
    const startIndex = this.getPeriodIndex(firstPeriod, periods);
    let endIndex = startIndex + numToShow;
    if (endIndex > periods.length) endIndex = periods.length;
    return periods.slice(startIndex, endIndex);
  }

  render() {
    const numPeriodsToShow = Settings.get(KEYS.DISPLAY.PERIOD_COUNT);
    const firstPeriod = Settings.get(KEYS.DISPLAY.FIRST_PERIOD);
    const catsToSummarize = this.getCategoriesToSum();
    const periods = this.getPeriodsToShow(this.props.periods, firstPeriod, numPeriodsToShow);

    return (
      <div class-name="row">
        <div className="col-12">

          <div className="row">
            <div className="col-6">
              <button
                className="btn btn-sm"
                disabled={this.periodsBeforeFirst() === 0}
                title="Step backward one period"
                onClick={() => this.setFirstPeriod(-1)}
              >
                <FaChevronLeft />
              </button>
                &nbsp;
              <button
                className="btn btn-sm"
                disabled={this.periodsBeforeFirst() < numPeriodsToShow}
                title="Jump backward one page"
                onClick={() => this.setFirstPeriod(-1 * numPeriodsToShow)}
              >
                <FaBackward />
              </button>
                &nbsp;
              <button
                className="btn btn-sm"
                disabled={this.periodsBeforeFirst() === 0}
                title="Go to the oldest period"
                onClick={() => this.setFirstPeriod(Number.MIN_SAFE_INTEGER)}
              >
                <FaStepBackward />
              </button>
            </div>
            <div className="col-6 text-right">
              <button
                className="btn btn-sm"
                disabled={this.periodsAfterLast() === 0}
                title="Go to the newest period"
                onClick={() => this.setFirstPeriod(Number.MAX_SAFE_INTEGER)}
              >
                <FaStepForward />
              </button>
                &nbsp;
              <button
                className="btn btn-sm"
                disabled={this.periodsAfterLast() < 3}
                title="Jump forward one page"
                onClick={() => this.setFirstPeriod(numPeriodsToShow)}
              >
                <FaForward />
              </button>
                &nbsp;
              <button
                className="btn btn-sm"
                disabled={this.periodsAfterLast() === 0}
                title="Step forward one period"
                onClick={() => this.setFirstPeriod(1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table width="100%" className="table table-condensed table-xs">
                <TransactionSummaryHeader periods={periods} />
                <tbody>
                  { this.props.groups.map((group) => (
                    <TransactionSummaryRow
                      key={group.id}
                      group={group}
                      periods={periods}
                      isSummarized={this.state.groupSummaries[group.name]}
                      showTransactions={this.props.showTransactions}
                      hideTransactions={this.props.hideTransactions}
                      toggleSummarized={this.toggleSummarized}
                    />
                  ))}
                  <tr>
                    <td colSpan="2" />
                    { periods.map((period) => (
                      <td key={period.id} className="text-right">
                        <strong>
                          {numeral(period.getCategorySums(catsToSummarize)).format('$0.00')}
                        </strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default TransactionSummaryTable;
