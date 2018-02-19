import React, { Component } from 'react';
import $ from "jquery";
import Kitchens from './Components/Kitchen';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      kitchens: []
    }
  }

    componentWillMount() {
      var currentMonth = new Date().getMonth();
      if (!!!localStorage.getItem("Kitchens-" + currentMonth)) {
        $.ajax({
          type: "GET",
          beforeSend: function(request) {
            request.setRequestHeader("Accept", "application/vnd.api.clustertruck.com; version=2");
          },
          url: "https://api.staging.clustertruck.com/api/kitchens",
          processData: false,
          async: false,
          success: function(data) {
            localStorage.setItem("Kitchens-" + new Date().getMonth(), JSON.stringify(data));
          }
        });
      }

      this.setState({kitchens: JSON.parse(localStorage.getItem("Kitchens-" + currentMonth))});
    }

  render() {
    let kitchenLocations = this.state.kitchens.map(kitchen => {
      return (
        <Kitchens key={kitchen.id} currentKitchen={kitchen} />
      );
    });

    return (
      <div className="App">
        {kitchenLocations}
      </div>
    );
  }
}

export default App;
