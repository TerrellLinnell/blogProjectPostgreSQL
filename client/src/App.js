import React from 'react';
import {Link} from 'react-router';
import {Navbar, NavItem, Nav, Alert} from 'react-bootstrap';
import $ from 'jquery';

var App = React.createClass({
  getInitialState: function () {
    return (
      {
        user         : null,
        username     : null,
        message      : null,
        messageStyle : 'danger'
      }
    )
  },
  getCurrentUser: function () {
    this.setState({user: this.props.route.auth.getUser()});
  },
  setCurrentUser: function (user) {
    this.setState({user: user});
  },
  componentWillMount: function () {
    this.getCurrentUser();
  },
  renderLogin: function () {
    if (this.state.user) {
      return (
        <NavItem><Link onClick={() => {this.props.route.auth.logout(); window.location='/'}}>Logout</Link></NavItem>
      );
    } else {
      return (
        <NavItem><Link to={'/login'}>Login</Link></NavItem>
      );
    }
  },
  onClickHandler: function () {
    $.ajax({
      url: '/logout',
      method: 'GET',
    }).done(function () {
      console.log('User logged out');
    });
  },
  render: function () {
    var alertCon = <Alert bsStyle={this.state.messageStyle}> { this.state.message } </Alert>;

    return (
      <div>
          <Navbar className='navbar' inverse >
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#"><img src="https://www.clipartsgram.com/image/689550139-smilingsimpleblackbackground-26197.jpg" role='presentation' height="40"/></a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem>The current user is: {this.state.user ? this.state.user : "None"}</NavItem>
              <NavItem><Link to={'/'}>Home</Link></NavItem>
              <NavItem><Link to={'/About'}>About</Link></NavItem>
              <NavItem><Link to={'/Portfolio'}>Portfolio</Link></NavItem>
              <NavItem><Link to={'/Blog'}>Blog</Link></NavItem>
              {this.renderLogin()}
            </Nav>
            <Nav>
              <NavItem><Link to={'/signup'}>Signup</Link></NavItem>
              <NavItem><Link to={'/login'}>Login</Link></NavItem>
              <NavItem onClick={() => this.onClickHandler()}> <Link to={'/logout'}> Logout </Link> </NavItem>
            </Nav>
          </Navbar>
        <div>
        {this.state.message? alertCon : null}
        {this.props.children && React.cloneElement(this.props.children,
          {
            setCurrentUser: this.setCurrentUser,
            getCurrentUser: this.getCurrentUser,
            user: this.state.user,
            auth: this.props.route.auth //sends auth instance from route to children
          })}
        </div>
      </div>
    )
  }
});

export default App;
