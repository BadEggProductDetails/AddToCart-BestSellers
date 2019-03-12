import React from "react";
// import ReactDOM from "react-dom";
// import axios from "axios";
import AddToCart from "./addToCart.jsx";
import BestSellers from "./bestSellers.jsx";
import { SIGWINCH } from "constants";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: this.props.data
    };
  }

  render() {
    return (
      <div className="aside">
        <AddToCart productInfo={this.state.productData[0] || {}} />
        <BestSellers data={this.state.productData} />
      </div>
    );
  }
}

// var mountNode = document.getElementById("app");
// ReactDOM.render(<App />, mountNode);
