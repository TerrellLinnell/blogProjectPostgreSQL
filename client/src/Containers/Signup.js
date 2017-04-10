import React from 'react';
import {Form, FormControl, FormGroup, Alert, Button} from 'react-bootstrap';
import $ from 'jquery';

var Signup = React.createClass({
  getInitialState: function () {
    return ({
      username : null,
      password : null,
      message  : null
    });
  },
  onChangeHandler: function (field, val) {
    var newData = {};
    newData[field] = val;
    this.setState(newData);
  },
  onSubmitHandler: function () {
    var self = this;
    console.log("Submitting the form");
    const User = {
      username: this.state.username,
      password: this.state.password
    };
    $.ajax({
      url:'/signup',
      method:"POST",
      data: User
    }).done(function (data) {
      if (data.message) {
        self.setState({message: data.message});
        console.log(self.state.message);
        window.location = '/#/signup';
      } else {
        self.setState({message: "User registered."});
        window.location = '/#/';
      }
    });
  },
  render: function () {
    var alertCon = <Alert bsStyle="danger"> {this.state.message} </Alert>;
    return(
      <div className='signupContainer'>
        {this.state.message? alertCon : null}
        <Form className='SignupForm'>
          <FormGroup>
            <FormControl className='SignupInput' type='text' placeholder='username' onChange={ (event) => this.onChangeHandler('username', event.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormControl className='SignupInput' type='text' placeholder='password' onChange={ (event) => this.onChangeHandler('password', event.target.value)} />
          </FormGroup>
        </Form>
        <Button className='SignupButton' bsStyle='success' onClick={ () => this.onSubmitHandler()}>Signup</Button>
      </div>
    )
  }
})

export default Signup;
