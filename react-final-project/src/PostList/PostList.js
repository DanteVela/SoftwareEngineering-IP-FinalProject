import React from 'react';
import Post from './Post';

// Import jQuery for AJAX
import $ from 'jquery';

// React URL: "http://localhost:3000/posts"
// Uses Backend URL to process Data: "http://localhost:5000/posts"

class PostList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        titleTextboxValue: "",
        urlTextboxValue: "",
        isLoaded: false,
        error: null,
        data: [],
      };
  
      this.handleAddButtonPress = this.handleAddButtonPress.bind(this);
      this.handleTitleTextboxChange = this.handleTitleTextboxChange.bind(this);
      this.handleUrlTextboxChange = this.handleUrlTextboxChange.bind(this);
      this.handleUpvote = this.handleUpvote.bind(this);
      this.handleDownvote = this.handleDownvote.bind(this);
    }

    componentDidMount(){
      //Part 1: Remove this hardcoded stuff and retrieve the data
      //from your Post API
      //- if loading succeeds make sure you set isLoaded to true in the state
      //- if loading fails set isLoaded to true AND error to true in the state
      $.ajax({
        // Heroku URL: https://mighty-wildwood-61435.herokuapp.com/ (Reference to HW 10)
        url: "http://localhost:5000/posts",
        method: "GET"
      }).done((json_result)=>{
        this.setState((state)=>{
          json_result.sort((a, b) => (a.points < b.points) ? 1 : -1)
          return{data: json_result, isLoaded:true};

          // return{data: json_result, isLoaded:true};
        });
      }).fail((error)=>{
        console.log(error);
        this.setState((state)=>{
          return{isLoaded:true, error:true};
        });   
      })

      /*let newData = [
        { id: 1, title: "Apple releases new M1 based Macbooks and Mac Mini", url: "https://www.apple.com/mac/m1/", points: 98 },
        { id: 2, title: "C++ for Dummies", url: "https://www.dummies.com/programming/cpp/", points: 0 },
        { id: 3, title: "Automate the Boring Stuff with Python", url: "https://automatetheboringstuff.com/", points: 90 },
        { id: 4, title: "New version of TailwindCSS released", url: "https://tailwindcss.com/", points: 90 }
      ];

      this.setState(function(state){
        return { data: newData, isLoaded: true };
      })*/
    }
  
    handleAddButtonPress() {
      //Part 2:
      //- Add the post to the API via AJAX call
      // -- if the call succeeds, add the copy of the post you receive from the API
      // to your local copy of the data
      // -- if an error occurs set error to true in the state
      $.ajax({
        // Heroku URL: https://mighty-wildwood-61435.herokuapp.com/ (Reference to HW 10)
        url: "http://localhost:5000/posts",
        method: "POST",
        data: {
          title: this.state.titleTextboxValue,
          url: this.state.urlTextboxValue,
          // points: 0
        }
      }).done((json_result)=>{
        let Post = this.state.data;

        // Push new Post into data
        Post.push({
          id: json_result.id,
          title: json_result.title,
          url: json_result.url,
          points: json_result.points
        });

        this.setState((state)=>{
          Post.sort((a, b) => (a.points < b.points) ? 1 : -1)
          return{data: Post};
          // return{data: Post};
        });
      }).fail((error)=>{
        console.log(error);
        this.setState((state)=>{
          return{error:true}; 
        });   
      })
    }
  
    handleTitleTextboxChange(event){
      this.setState(
        function(state){
          return { titleTextboxValue: event.target.value };
        }
      )
    }

    handleUrlTextboxChange(event){
      this.setState(
        function(state){
          return { urlTextboxValue: event.target.value };
        }
      )
    }

    handleUpvote(id){
        //Part 3: 
        //- Modify the local copy of the data
        //- Upvote the post on the server via API call
        //- if an error occurs set error to true in the state

        // Debug for id issues
        // console.log(this.state.data);
        // console.log(id);

        let counter = 0;
        let index = 0;

        this.state.data.forEach(function(Post){
          if(Post.id === id) {
              index = counter;       // res.json(Post);
          }
          counter++;
        });

        $.ajax({
          // Heroku URL: https://mighty-wildwood-61435.herokuapp.com/ (Reference to HW 10)
          url: "http://localhost:5000/posts/"+ id +"/upvote",
          method: "PATCH"
        }).done((json_result)=>{
          // Create variable to modify the state indirectly
          let upvote = this.state.data;
          upvote[index].points += 1;

          this.setState((state)=>{
            upvote.sort((a, b) => (a.points < b.points) ? 1 : -1)
            return{data: upvote};
            // return{data: upvote};
          });
        }).fail((error)=>{
          console.log(error);
          this.setState((state)=>{
            return{error:true}; 
          });   
        })
    }

    handleDownvote(id){
        //Part 4:
        //- Modify the local copy of the data
        //- Downvote the post on the server via API call
        //- if an error occurs set error to true in the state

        // Debug for id issues
        // console.log(this.state.data);
        // console.log(id);

        let counter = 0;
        let index = 0;

        this.state.data.forEach(function(Post){
          if(Post.id === id) {
              index = counter;       // res.json(Post);
          }
          counter++;
        });

        $.ajax({
          // Heroku URL: https://mighty-wildwood-61435.herokuapp.com/ (Reference to HW 10)
          url: "http://localhost:5000/posts/"+ id +"/downvote",
          method: "PATCH"
        }).done((json_result)=>{
          // Create variable to modify the state indirectly
          let downvote = this.state.data;
          
          if(downvote[index].points > 0)
          {
            downvote[index].points -= 1;
          }
          
          this.setState((state)=>{
            downvote.sort((a, b) => (a.points < b.points) ? 1 : -1)
            return{data: downvote};
            // return{data: downvote};
          });
        }).fail((error)=>{
          console.log(error);
          this.setState((state)=>{
            return{error:true}; 
          });   
        })
    }
  
    render() {
      let error = this.state.error;
      let isLoaded = this.state.isLoaded;

      if(error){
        return <div>Sorry, an error occurred.</div>
      }else if(!isLoaded){
        return <div>Loading...</div>
      }else{
        let handleUpvote = this.handleUpvote;
        let handleDownvote = this.handleDownvote;
        let todoList = this.state.data.map(function (post) {
          return <Post key={post.id} id={post.id} title={post.title} url={post.url} points={post.points} handleUpvote={ handleUpvote } handleDownvote={ handleDownvote }></Post>
        });
    
        return (
          <div>
            <h3>Tech News</h3>
            { todoList}
            <br/><div id= "subBox">
              <div id="submission">New Submission</div>{/*<br/>*/}
              <span id="Title">Title:</span><input type="text" value={ this.state.titleTextboxValue } onChange={ this.handleTitleTextboxChange } id="TitleBox"></input><br/>
              <span id="URL">URL: </span><input type="text" value={ this.state.urlTextboxValue } onChange={ this.handleUrlTextboxChange } id="URLbox"></input><br/>

              <button onClick={this.handleAddButtonPress} id="subBut">Submit</button>
            </div>
          </div>
        );
      }
    }
  }

export default PostList;