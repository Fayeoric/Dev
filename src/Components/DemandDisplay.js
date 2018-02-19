import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';

class DemandDisplays extends Component {

  constructor() {
    super();
    this.state = {
      DemandModifier: {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 3,
        Sunday: 3,
        Rain: 4,
        Snow: 5,
        NiceWeather: -2,
        LastDayOfMonth: 5
      },
      DaysOfTheWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }
  }

  // Will be different every month so we need to calculate what it is for the current month
  getHighestDemandIndex() {
    let currentDT = new Date()
    let lastDayofMonth = new Date(currentDT.getYear(), currentDT.getMonth() + 1, 0);
    let dayModifier = this.state.DemandModifier[this.state.DaysOfTheWeek[lastDayofMonth.getDay()]];
    // Day Modifier + Weather Modfier + Last Day of Month Modifier
    return dayModifier + this.state.DemandModifier.Snow + this.state.DemandModifier.LastDayOfMonth;
  }

  getLowestDemandIndex() {
    return this.state.DemandModifier.Monday + this.state.DemandModifier.NiceWeather;
  }

  getCurrentDayShort() {
    let shortDaysofWeek = ["Sun","Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
    let currentDate = new Date(this.props.currentForcast.time * 1000);
    return shortDaysofWeek[currentDate.getDay()]

  }
  getCurrentDate() {
    let currentDate = new Date(this.props.currentForcast.time * 1000);
    return currentDate.toLocaleDateString("en-US");
  }

  getCurrentDemandIndex() {
      // First Modifier
    let currentDayModifier = this.state.DemandModifier[this.state.DaysOfTheWeek[new Date(this.props.currentForcast.time * 1000).getDay()]];

    // Based on average comfortable temperature data from https://en.wikipedia.org/wiki/Room_temperature
    let lowTemperatureForNiceWeather = 68;
    let highTemperatureForNiceWeather = 75;

    // Second Modifier
    let weatherModifier = 0;

    if (!!this.props.currentForcast.precipType) {
      if (this.props.currentForcast.precipType.toLowerCase() === "rain" && this.props.currentForcast.precipProbability > 0.6)
        weatherModifier = this.state.DemandModifier.Rain;
      else if (this.props.currentForcast.precipType.toLowerCase() === "rain" && this.props.currentForcast.precipProbability > 0.6)
        weatherModifier = this.state.DemandModifier.Snow;
    } else if ((lowTemperatureForNiceWeather <= this.props.currentForcast.temperatureMax) && (this.props.currentForcast.temperatureMax <= highTemperatureForNiceWeather)) // Using temperatureMax in the assumption that the highest temperature is at afternoon
      weatherModifier = this.state.DemandModifier.NiceWeather;

      let currentDT = new Date()
      let lastDayofMonth = new Date(currentDT.getYear(), currentDT.getMonth() + 1, 0);

      // Final Modifier
      let lastDayModifier = lastDayofMonth === new Date(this.props.currentForcast.time * 1000) ? this.state.DemandModifier.LastDayOfMonth : 0;

      return currentDayModifier + weatherModifier + lastDayModifier;

  }

  getDemandRatio(currentDemandIndex) {
    let counter = 0;
    for (let i = this.getLowestDemandIndex(); i <= this.getHighestDemandIndex(); i++ ) {
      counter++;
    }

    return currentDemandIndex / counter;
  }

  // Get a gradient to display color-wise to illustrate the demand
  getGradientColor(ratio) {
    return (ratio >= 0.66) ? "#FF5353" : ((ratio < 0.66) && (ratio > 0.33) ? "#FFD062" : "#4f86f6");
  }

  getDemandValue(ratio) {
    return (ratio >= 0.66) ? "High" : ((ratio < 0.66) && (ratio > 0.33) ? "Moderate" : "Low");
  }

  render() {
    let shortDay = this.getCurrentDayShort();
    let curDay = this.getCurrentDate();
    let dModifier = this.getCurrentDemandIndex();
    let demandValue = this.getDemandValue(this.getDemandRatio(dModifier));
    let bgColor = this.getGradientColor(this.getDemandRatio(dModifier));
    return (
      <Col xs={12} md={2}>
        <Panel>
          <Panel.Body>
            <div className="divTop" style={{backgroundColor: bgColor, padding: "10px", color: "#fff", height: "70%"}}>
              <div className="divDemand">
                {demandValue}
              </div>
            </div>
            <div className="divBottom">
              <div className="divLeft">
                <div className="divTempHigh">
                  <span className="highTemp">{Math.round(this.props.currentForcast.temperatureMax)}</span>
                </div>
                <div className="divTempLow">
                  <span className="lowTemp">{Math.round(this.props.currentForcast.temperatureMin)}</span>
                </div>
              </div>
              <div className="divRight">
                <div className="headInfo">
                  {shortDay}
                </div>
                <div className="divDate">
                  {curDay}
                </div>
              </div>

            </div>
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

export default DemandDisplays;
