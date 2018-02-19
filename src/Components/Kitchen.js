import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';
import $ from "jquery";
import DemandDisplays from '../Components/DemandDisplay';

class Kitchens extends Component {
  constructor() {
    super();
    this.state = {
      forcastData: []
    }
  }

  componentWillMount() {
    let currentDate = new Date();
    if (!!!localStorage.getItem("Forcast-" + this.props.currentKitchen.name + "_" + currentDate.getDate() + "_" + currentDate.getYear())) {
      $.ajax({
        type: "GET",
        url: "https://1f035595.ngrok.io/proxy/" + this.props.currentKitchen.location.lat +"," + this.props.currentKitchen.location.lng,
        processData: false,
        async: false,
        success: function(data) {
          let curDate = new Date();
          localStorage.setItem("Forcast-" + this.props.currentKitchen.name + "_" + curDate.getDate() + "_" + curDate.getYear(), JSON.stringify(data));

        }.bind(this)
      });
    }

    this.setState({forcastData: JSON.parse(localStorage.getItem("Forcast-" + this.props.currentKitchen.name + "_" + currentDate.getDate() + "_" + currentDate.getYear()))});

  }


  render() {

    let ddItems = this.state.forcastData.daily.data.map( currentDayForcast => {
      return (
        <DemandDisplays key={currentDayForcast.time} currentForcast={currentDayForcast} />
      )
    })

    return (
      <Grid>
        <Row>
          <h3>{this.props.currentKitchen.name} Kitchen</h3>
          {ddItems}
        </Row>
        <br />
      </Grid>
    );
  }
}

export default Kitchens;
