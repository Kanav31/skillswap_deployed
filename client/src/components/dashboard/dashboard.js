import React from 'react'
import './dashboard.css'
import frame from "./img/frame-4.jpg"
import frame1 from "./img/frame-4-1.jpg"
import home3 from "./img/home-3.jpg"
import home2 from "./img/home-2.jpg"
import home from "./img/home.jpg"
import image11 from "./img/image-11.png"
import image10 from "./img/image-10.png"
import data from "./img/3d-data-management-2.png"
import grad from "./img/grad-01.png"
import cloud from "./img/3d-object-cloud-storage-1-1.png"
import folder from "./img/folder.jpg"
import vector1 from "./img/vector-1.jpg"
import object from "./img/object.png"
import rectangle5 from "./img/rectangle-5.png"
import rectangle6 from "./img/rectangle-6.png"
import rectangle7 from "./img/rectangle-7.png"
import { useNavigate } from "react-router-dom";
import Navbar from '../navigation/NavigationBar'


const Dashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    console.log("logout");
    try {
      // Clear local storage item
     ;
      localStorage.removeItem('userLoginInfo');
      
      // Navigate to the home page or login page
      navigate("/");
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  return (
    <div>

    <Navbar/>
    <div className="skill-dashboard">
      
      <div className="div">
        <div className="overlap">
          <div className="frame">
            <div className="frame-2" onClick={logout}>
               <img className="img" src={frame} alt=""/>
              <div className="text-wrapper">Logout</div>
            </div>
            {/* <button className="ishita" onClick={() => console.log('Clicked')}>hehe</button> */}
            <div className="frame-2" onClick={() => navigate("/userinfo")}>
              <img className="img" src={frame1} alt=""/>
              <div className="text-wrapper">Profile</div>
            </div>
          </div>
          <div className="frame-3">
            <div className="frame-4">
              <div className="frame-5" onClick={() => navigate("/")}>
                <img className="home myhome" src={home3} alt=""/>
                <div className="text-wrapper-2">Home</div>
              </div>
              <div className="frame-5" onClick={() => navigate("/matching")}>
                <img className="home" src={home2} alt=""/>
                <div className="text-wrapper-2">Matches</div>
              </div>
            </div>
            <div className="frame-4">
              <div className="frame-5">
                <img className="home" src={home} alt=""/>
                <div className="text-wrapper-2">Invites</div>
              </div>
              <div className="frame-6" onClick={()=>{navigate('/todo')}}>
                <img className="home" src={home} alt=""/>
                <div className="text-wrapper-3">Todo</div>
                <div className="group">
                  <div className="dashboard-rectangle"></div>
                 
                </div>
              </div>
            </div>
            <div className="frame-4">
              <div className="frame-5" onClick={()=>{navigate('/queries')}}>
                <div className="frame-wrapper">
                  <div className="image-wrapper"><img class="image" src={image11} alt=""/></div>
                </div>
                <div className="text-wrapper-5">Doubts</div>
              </div>
              <div className="frame-7" onClick={()=>{navigate('/confirmedmatches')}}>
                <div className="img-wrapper"><img class="image-2" src={image10} alt=""/></div>
                <div className="text-wrapper-6">Messages</div>
              </div>
            </div>
            <div className="group-2">
              <div className="dashboard-rectangle"></div>
             
            </div>
          </div>
          <div className="div-wrapper">
            <div className="frame-8">
              <div className="frame-9"><div class="text-wrapper-7">Get Started ✨</div></div>
              <div className="frame-10" onClick={() => navigate("/matching")}><div class="text-wrapper-8">See possible matches</div></div>
              <img className="element-data-management" src={data} alt=""/>
            </div>
          </div>
        </div>
        <div className="overlap-group-wrapper">
          <div className="overlap-group">
            <div className="frame-11">
              <img className="grad" src={grad} alt=""/>
              <div className="text-wrapper-9">Why SkillSwap?</div>
              <p className="p">
                Discover a community where expertise converges, paving the way for skill exchange and personal growth.
                Join us to connect, share knowledge, and forge meaningful collaborations. Explore a platform tailored to
                elevate your skills and passions to new heights.
              </p>
            </div>
            <img className="element-object-cloud" src={cloud} alt=""/>
          </div>
        </div>
        <div className="frame-12">
          <img className="img-2" src={folder} alt=""/>
          <div className="text-wrapper-10">To-do lists</div>
        </div>
       
        <div className="frame-14">
          <div className="frame-15">
            <div className="overlap-group-2" onClick={()=>{navigate('/todo')}}>
              <div className="frame-16"><div class="text-wrapper-11">My lists</div></div>
              <div className="text-wrapper-12">Open</div>
              <div className="text-wrapper-13">....... Files</div>
              <div className="overlap-2">
                <img className="vector" src={vector1} alt=""/> <img class="object" src={object} alt=""/>
              </div>
             
              <div className="text-wrapper-15">Shared With:</div>
              <div className="frame-17">
                <img className="rectangle-2" src={rectangle5} alt=""/>
                <img className="rectangle-3" src={rectangle6} alt=""/>
                <img className="rectangle-3" src={rectangle7} alt=""/>
                <div className="frame-18"><div class="text-wrapper-16">+9</div></div>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
    </div>
  )
}

export default Dashboard;





