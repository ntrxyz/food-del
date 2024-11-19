import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
         <img src={assets.logo}/>
         <p>An online food delivery website offering a culinary adventure delivered to your doorstep.</p>
         <div className="footer-social-icons">
            <img src={assets.facebook_icon} />
            <img src={assets.twitter_icon} />
            <img src={assets.linkedin_icon} />
         </div>
        </div>
        <div className="footer-content-center">
         <h2>COMPANY</h2>
         <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
         </ul>
        </div>
        <div className="footer-content-right">
        <h2>GET IN TOUCH</h2>
        <ul>
            <li>7777777777</li>
            <li>contact@foodvoyage.com</li>
        </ul>
        </div>
        
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2024 ⓒ FoodVoyage.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
