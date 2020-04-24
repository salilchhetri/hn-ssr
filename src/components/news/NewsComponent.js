import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./NewsComponent.scss";

import SingleNewsComponent from "./singleNews/SingleNewsComponent";
import LineChart from "../shared/line-chart/LineChartComponent";

export default class NewsComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      news: [],
      hidden: [],
      upVotes: [],
      allVotes: [],
      currentPage: 1,
      queryStr: "search?tags=front_page&hitsPerPage=10&page=",
    };
  }

  getNews = (page = 1) => {
    let url = `http://hn.algolia.com/api/v1/${this.state.queryStr}${page}`;
    fetch(url)
      .then((response) => response.json())
      .then((news) => {
        if (news.hits.length === 0) {
          alert("No more news available");
          return;
        }
        if (this.state.hidden.length > 0) {
          news = news.hits.filter((article) => {
            return !this.state.hidden.includes(article.objectID);
          });
        } else {
          news = news.hits;
        }

        if (this.state.upVotes.length > 0) {
          news = news.map((n) => {
            this.state.upVotes.forEach((vote) => {
              if (vote === n.objectID) {
                n.points = n.points + 1;
              }
            });
            return n;
          });
        }
        let allVotesData = [...this.state.allVotes];
        allVotesData = news.map((n) => {
          return { id: n.objectID, points: n.points };
        });
        this.setState({ allVotes: allVotesData });
        this.setState({ news });
      });
    console.log(this.state.news);
  };

  componentDidMount() {
    let hiddenByUser = JSON.parse(localStorage.getItem("hiddenArticles"));
    if (hiddenByUser !== null) {
      this.setState({ hidden: hiddenByUser });
    }

    let userUpVotes = JSON.parse(localStorage.getItem("userUpVotes"));
    if (userUpVotes !== null) {
      this.setState({ upVotes: userUpVotes });
    }
    this.getNews();
  }

  handleUpvote = (id) => {
    // **** Create a service for upvote ....
    let votes = [...this.state.upVotes];
    let udpatedNews = [...this.state.news];

    let count = 1;

    votes.forEach((vote) => {
      if (vote === id) {
        count++;
      }
    });

    const current = udpatedNews.find((element) => {
      return element.objectID === id;
    });
    if (count <= 10) {
      current.points = current.points + 1;
      votes.push(id);
      localStorage.setItem("userUpVotes", JSON.stringify(votes));
    } else {
      alert("Oops! You have exhausted your 10 votes on this feed.");
    }
    this.setState({ news: udpatedNews, upVotes: votes });
  };

  hideArticles = (id) => {
    let hiddenNews = [...this.state.hidden];
    let udpatedNews = [...this.state.news];
    udpatedNews = udpatedNews.filter((element) => {
      return element.objectID !== id;
    });
    hiddenNews.push(id);
    this.setState({ news: udpatedNews, hidden: hiddenNews }, () => {
      localStorage.setItem("hiddenArticles", JSON.stringify(this.state.hidden));
    });
  };

  loadMoreNews = () => {
    this.setState(
      (prevState, props) => ({
        currentPage: prevState.currentPage++,
      }),
      () => {
        this.getNews(this.state.currentPage);
      }
    );
  };

  render() {
    let linkStyle = {
      color: "#EB6E58",
      fontSize: "1em",
      marginTop: "4px",
    };
    return (
      <Container fluid>
        <Row>
          <Col>
            <div className="cssTable">
              {this.state.news.length > 0
                ? this.state.news.map((article, index) => {
                  return (
                    <SingleNewsComponent
                      key={index}
                      data={article}
                      handleUpvote={() => this.handleUpvote(article.objectID)}
                      handleHide={() => this.hideArticles(article.objectID)}
                    />
                  );
                })
                : null}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.news.length > 0 ? (
              <Button
                variant="link"
                style={linkStyle}
                className="orangeLink"
                onClick={this.loadMoreNews}
              >
                More
              </Button>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.news.length > 0 ? (
              <LineChart data={this.state.news} label="Upvotes" />
            ) : (
                ""
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}
