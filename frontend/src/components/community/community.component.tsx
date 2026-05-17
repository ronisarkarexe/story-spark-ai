import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GenreCard from './genre_card.component';
import NavListComponent from '../hero/nav_list.component';
import NotificationComponent from '../notification/notification.component';
import { NotificationResponse } from '../../models/notification';
import { socketIo } from '../../socket/socket.oi';
import { isLoggedIn } from '../../services/auth.service';
import { genres, featuredWriters, resources, stats } from './community.data';

const CommunityComponent: React.FC = () => {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const isLogin = isLoggedIn();
  const MAX_NOTIFICATIONS = 100;

  useEffect(() => {
    socketIo.on("pushNotification", (data: NotificationResponse) => {
      setNotifications((prev) => {
        const next = [...prev, data];
        return next.length > MAX_NOTIFICATIONS 
          ? next.slice(next.length - MAX_NOTIFICATIONS) 
          : next;
      });
    });
    return () => {
      socketIo.off("pushNotification");
    };
  }, []);

  return (
    <div className="gradient-bg min-h-screen text-white">
      <NavListComponent
        setShowNotification={setShowNotification}
        newNotify={notifications.length}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Community Hub Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Where Imagination <br /> Meets Community
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of writers using AI to spark their creativity. Share your stories, 
            get feedback, and find your next great narrative adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="w-full !rounded-button bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
                JOIN DISCORD
              </button>
            </a>
            <Link to="/community#guidelines" className="w-full sm:w-auto">
              <button className="w-full !rounded-button bg-transparent border border-white/20 hover:bg-white/5 text-white px-10 py-4 font-bold transition-all cursor-pointer">
                VIEW GUIDELINES
              </button>
            </Link>
          </div>
        </div>
      </section>

      {showNotification && (
        <NotificationComponent
          notifications={notifications}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      )}

      {/* Genre Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Explore Genre Hubs</h2>
            <p className="text-gray-400">
              Find your niche and connect with specialists in your favorite storytelling styles. 
              Each hub offers specific AI prompt templates and discussion boards.
            </p>
          </div>
          <Link to="/community/genres" className="group flex items-center text-blue-400 font-semibold transition-all">
            <span className="underline underline-offset-8 decoration-blue-500/30 group-hover:decoration-blue-500 transition-all">VIEW ALL GENRES</span>
            <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {genres.map((genre, index) => (
            <GenreCard key={index} {...genre} isLogin={isLogin} />
          ))}
        </div>
      </section>

      {/* Featured Writers Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="p-12 bg-white/5 rounded-3xl border border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Community Spotlight</h2>
            <p className="text-gray-400">Meet the pioneers of AI-assisted storytelling.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredWriters.map((writer, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <img 
                    src={writer.avatar} 
                    alt={writer.name} 
                    className="w-24 h-24 rounded-full border-2 border-white/10 group-hover:border-blue-500 transition-colors relative z-10 object-cover" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{writer.name}</h3>
                <p className="text-blue-400 text-sm mb-4">{writer.role}</p>
                <div className="text-xs text-gray-500 uppercase tracking-widest">
                  {writer.stories} Stories Published
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Writing Resources Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Writing Resources</h2>
          <button className="!rounded-button text-sm font-semibold px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            BROWSE ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${resource.icon} text-xl`}></i>
              </div>
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
                {resource.category}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                {resource.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <i className="fa-regular fa-clock mr-2 text-blue-400"></i> {resource.readTime} read
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section id="guidelines" className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="p-16 rounded-[2.5rem] bg-gradient-to-br from-blue-900/40 via-slate-900 to-black border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to spark your first story?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Experience the power of generative AI and join the most innovative writing community on the web.
          </p>
          <Link to={isLogin ? "/dashboard" : "/signup"}>
            <button className="!rounded-button bg-white text-black px-12 py-5 font-bold hover:bg-gray-200 transition-all shadow-xl hover:shadow-white/10 cursor-pointer">
              {isLogin ? "GO TO DASHBOARD" : "GET STARTED FOR FREE"}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CommunityComponent;

