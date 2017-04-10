import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Home from './Views/Home';
import About from './Containers/About';
import Portfolio from './Containers/Portfolio';
import Signup from './Containers/Signup';
import Login from './Containers/Login';
import Blog from './Containers/Blog';
import UpdatePostContainer from './Containers/UpdatePostContainer';
import UpdateCommentContainer from './Containers/UpdateCommentContainer';
import AuthService from './Containers/AuthService';

var auth = new AuthService('sYmsgnVj4nP1RfZjCGew1FVMNkx105C9', 'terrelllinnell.auth0.com');

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

ReactDOM.render(
  <Router history={hashHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Home} onEnter={requireAuth}/>
      <Route path='/About' component={About} onEnter={requireAuth}/>
      <Route path='/Portfolio' component={Portfolio} onEnter={requireAuth}/>
      <Route path='/signup' component={Signup} />
      <Route path='/login' component={Login} />
      <Route path='/Blog' component={Blog} onEnter={requireAuth}/>
      <Route path='/UpdatePostContainer/:postId' component={UpdatePostContainer} onEnter={requireAuth}/>
      <Route path='/UpdateCommentContainer/:commentId' component={UpdateCommentContainer} onEnter={requireAuth}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
