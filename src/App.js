import React, { Component } from "react";
import RepoList from "./Components/RepoList";
import Loading from "./Components/Loading";
import Repo from "./Components/Repo";
import axios from "axios";
import moment from "moment";
import "./styles.css";
import { useState } from "react";

class App extends Component {
  DATE_30_DAYS_BEFORE = moment().subtract(30, "days").format("YYYY-MM-DD");
  constructor() {
    super();
    this.state = {
      repo: [],
      error: "",
      page: 1,
      loading: true
    };
  }

  componentDidMount() {
    this.loadRepo(); // load the initial Repos
    window.addEventListener("scroll", this.handleLoadMore);
  }

  loadRepo = () => {
    const { page, repo } = this.state;
    console.log("temp", this.DATE_30_DAYS_BEFORE);

    // Getting the data from Github API

    axios
      .get(
        ` https://api.github.com/search/repositories?q=created:>${this.DATE_30_DAYS_BEFORE}&sort=stars&order=desc&page=${page} `
        // https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc
      )

      .then((resp) => {
        // console.log(resp)

        this.setState({
          // repo: resp.data.items,
          repo: [...repo, ...resp.data.items], // here when scrolling, Repo get updated instantly
          loading: false
        });

        console.log("Repo Updated: ", resp.data.items);
      })

      .catch((error) => {
        this.setState({
          error: error,
          loding: false
        });
      });
  };

  handleLoadMore = () => {
    const { loading } = this.state;

    if (
      window.pageYOffset + window.innerHeight >= window.innerHeight &&
      !loading
    ) {
      this.loadData();
    }
  };

  loadData = () => {
    const { page } = this.state;

    this.setState((prevState) => ({
      page: prevState.page + page,
      loading: true
    }));
    this.loadRepo();
  };

  handleClick = (event, param) => {
    this.DATE_30_DAYS_BEFORE = moment()
      .subtract(param, "days")
      .format("YYYY-MM-DD");
    console.log("temp", event);
    this.loadRepo();
    // console.log(param);
    // this.loadData()
  };
  render() {
    const { repo } = this.state;

    return (
      <div>
        <div>
          <div class="dropdown">
            <button class="dropbtn">Dropdown</button>
            <div class="dropdown-content">
              <a onClick={(event) => this.handleClick(event, "7")}>1 week</a>
              <a href="#" onClick={(event) => this.handleClick(event, "14")}>
                2 week
              </a>
              <a href="#" onClick={(event) => this.handleClick(event, "30")}>
                1 Month
              </a>
            </div>
          </div>

          <RepoList repo={repo} />
          <Loading />
        </div>
      </div>
    );
  }
}

export default App;
