import React from 'react';
import {NavLink, Link} from 'react-router-dom'




const Navbar = (props) => (

 
 <div className="sidenav"> 
 <ul>
	<li><NavLink className="sidenav-li" activeClassName="activate" exact to="/">Home</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/uploads">Upload</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/profile/albums">Profile</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/account">Account</NavLink></li>
	<li><NavLink className="sidenav-li" activeClassName="activate" to="/premium">Premium</NavLink></li>
	</ul>

	<div className="sidenav-footer">
	<ul>
	<li><Link className="sidenav-footer-li" to="/mobile-terms-of-service">Terms Of Service</Link></li>
	<li><Link className="sidenav-footer-li" to="/mobile-privacy-policy">Privacy Policy</Link></li>
	</ul>
	</div>

  </div>



	);

export default Navbar;