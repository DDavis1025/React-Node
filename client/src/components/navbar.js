import React from 'react';
import {NavLink} from 'react-router-dom'


const Navbar = (props) => (

 
 <div className="sidenav"> 
 <ul>
	<li><NavLink className="sidenav-li" activeClassName="activate" exact to="/">Home</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/uploads">Upload</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/albums">Profile</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/account">Account</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/premium">Premium</NavLink></li>
	</ul>

	<div className="sidenav-footer">
	<ul>
	<li><a className="sidenav-footer-li" href="/privacy-policy">Privacy Policy</a></li>
	</ul>
	</div>

  </div>



	);

export default Navbar;