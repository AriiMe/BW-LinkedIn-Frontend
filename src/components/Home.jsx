import React, { Component } from "react";
import { Container, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { BiLike, BiCommentDetail, BiShare, BiSend } from "react-icons/bi";
import EditPost from "./EditPost";
import PostModal from "./PostModal";
import RSidebar from "./RSidebar";
import Sidebar from "./Sidebar";
import "../styles/Home.css";
export default class Home extends Component {
  state = {
    posts: [],
    me: {},
    showAlert: null,
    err: false,
    errType: null,
    errMsg: "",
    loading: true,
  };
  fetchPost = async () => {
    console.log("Bearer " + localStorage.getItem("token"));
    try {
      const response = await fetch(
        "https://linkedin-bw-clone.herokuapp.com/api/posts",
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        let postResponse = await response.json();
        console.log(postResponse);
        postResponse = postResponse.reverse().slice(0, 50);
        this.setState({ posts: postResponse, loading: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
        err: true,
        errType: "danger",
        errMsg: error.messasge,
      });
    }
  };
  fetchMe = async () => {
    try {
      const meFetch = await fetch(
        "https://linkedin-bw-clone.herokuapp.com/api/profile/me",
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const meResponse = await meFetch.json();
      console.log(meResponse);
      this.setState({ me: meResponse });
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.fetchPost();
    this.fetchMe();
  }
  render() {
    return (
      <div className="homeDiv">
        <Container className="HomeCont">
          {this.state.err && (
            <Alert variant="danger">{this.state.errMsg}</Alert>
          )}
          {
            this.state.loading && this.state.err !== true ? (
              <div
                style={{ position: "relative", top: "8vh", left: "25vw" }}
                className="lds-facebook"
              ></div>
            ) : Object.keys(this.state.posts).length !== 0 ? (
              <Row>
                <Col className="d-none d-lg-block" lg={3}>
                  <RSidebar me={this.state.me} />
                </Col>
                <Col lg={6} md={9}>
                  <PostModal
                    refetch={() => this.fetchPost()}
                    me={this.state.me}
                  />
                  {this.state.posts.map((post) => (
                    <Card className="w-100 my-4" key={`feed${post.id}`}>
                      <Card.Header className="d-flex justify-content-between px-3">
                        <div>
                          <img
                            src={post.profile.imgurl}
                            className="postModalImg mr-3"
                          />
                          {post.profile.name + " " + post.profile.surename}
                        </div>
                        <EditPost
                          post={post}
                          refetch={() => this.fetchPost()}
                        />
                      </Card.Header>
                      {post.imgurl && (
                        <Card.Img
                          src={post.imgurl}
                          alt="Postimgurl"
                          className="postimgurl"
                        />
                      )}
                      <Card.Text className="p-3">{post.text}</Card.Text>
                      <Card.Footer className="HomeModal bg-white">
                        <Button variant="outline-dark mx-1">
                          <BiLike /> Like
                        </Button>
                        <Button variant="outline-dark mx-1">
                          <BiCommentDetail /> Comment
                        </Button>
                        <Button variant="outline-dark mx-1">
                          <BiShare /> Share
                        </Button>
                        <Button variant="outline-dark mx-1">
                          <BiSend /> Send
                        </Button>
                      </Card.Footer>
                    </Card>
                  ))}
                </Col>
                <Col className="d-none d-md-block" md={3}>
                  <Sidebar />
                </Col>
              </Row>
            ) : (
              <div></div>
            )
            /**: true,
              errType: "warning",
              errMsg: "We have encounter a problem, the profile is empty",
            }) **/
          }
        </Container>
      </div>
    );
  }
}
