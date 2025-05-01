import React from 'react';

class Post extends React.Component {
  constructor(props) {
    //boilerplate
    super(props);
    //hack to know about this
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote() {
    this.props.handleUpvote(this.props.id);
  }

  handleDownvote(){
    this.props.handleDownvote(this.props.id);
  }

  render() {
    //return JSX element

    // Code below is used to seperate the domain name ("apple") with domain suffix (such as ".com")
    let URL = (this.props.url);
    let urlParts = URL.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/);
    let domainName = urlParts[0];
    
    // Used for Debugging URLs
    // console.log("domain: ", domainName);

    return (
      <li>
        <div id="upvote" onClick={ this.handleUpvote }>{/*<button onClick={ this.handleUpvote } id="upvoteBut">Upvote</button>*/}</div>
        <div id="downvote" onClick={ this.handleDownvote }>{/*<button onClick={ this.handleDownvote } id="downvoteBut">Downvote</button>*/}</div>
        <span id="WebTitle">{this.props.title}</span> <span id="WebURL">{"(" + domainName + ")"}</span> <br/><div id="WebPoints">{this.props.points + " points"}</div> 
      </li>
    )
  }
}

export default Post;