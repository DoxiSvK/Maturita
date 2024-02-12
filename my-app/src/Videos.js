import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Videos.css";
import LoadingScreen from "./Loading"; // Import your loading screen component here

function Videos() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const videosData = [
    {
      id: "JsFGangWRuc",
      title: "Aesthetic Dark Lightroom Presets",
      description: "How to Edit Professional Aesthetic Dark Preset Photography | Best Aesthetic Lightroom Presets DNG Free Download 2023 | Premium Presets Pack For Free | Creating Professional Aesthetic Lightroom Presets",
    },
    {
      id: "uOUXDipWeN8",
      title: "Glow Effect - Photoshop Tutorial",
      description: "In This Advanced Glow/Glowing Effect Photoshop Tutorial, learn How to make glowing effect in photoshop. I will show you how to make glow effect or glow object in photoshop.",
    },
    {
      id: "z0ckMwQxc1s",
      title: "The Making of Photo-Manipulation: Explore",
      description: "In this video, we learn how to create a photomanipulation in photoshop, step by step.",
    },
    {
      id: "rZRA7oYPvwA",
      title: "7 Beginner Photo Manipulation Mistakes (and How to Fix them) in Photoshop!",
      description: "In this video, I will share with you beginner mistakes in #Photoshop photo manipulation and also tell you the ways to fix them.",
    },
    {
      id: "-ZoDHEsd0Y4",
      title: "Easy 2D to 3D Illustration Hack for Beginners | Adobe Illustrator Tutorial",
      description: "Create your own 3D, clay effect rainbow in this Adobe Illustrator tutorial.",
    },
    {
      id: "IsF29OzFfZQ",
      title: "EASY Character Illustration in Adobe Illustrator! 🎨",
      description: "In this tutorial, I walk you through a beginner's approach to creating a simple vector character illustration inside of Adobe Illustrator! ",
    },
    {
      id: "HeLb0dy81Lc",
      title: "Adobe Illustrator for Beginners - Sketch to Vector Tutorial",
      description: "Learn how to bring your sketches alive with the Dell XPS empowered by NVIDIA! ",
    },
    {
      id: "5V83pPtUfgA",
      title: "Make Glowing Portrait Design - Photoshop Tutorial",
      description: "In this tutorial I will show you how to make Glowing Portrait Design with Mixer Brush tool in Adobe Photoshop",
    },
    {
      id: "zzenjkUSeG4",
      title: "Turn your Image to Glowing Portrait in Photoshop",
      description: "In this tutorial I will show you how to turn your photo to Glowing Portrait in Adobe Photoshop.",
    },
    {
        id: "ORUoAVxXxsY",
        title: "How To Add REALISTIC Highlights in Photoshop!",
        description: "In today's video I'm doing an updated highlights tutorial!",
      },
      {
        id: "mQSKseBlA4c",
        title: "How To Glow Anything in Photoshop | Glowing Object | Photoshop Tutorial (Easy)",
        description: "In this Glow/Glowing Effect Photoshop Tutorial, learn How to glow anything or any objects in photoshop easily.",
      },
      {
        id: "LZe5R0MmuDg",
        title: "Photoshop Tutorial - Photoshop Compositing Tutorial | Photo Manipulation",
        description: "In This Composite/Photo Manipulation Photoshop Tutorial, learn How to blend images and create a composite in photoshop.",
      },
      {
        id: "-CIFGBcbPPg",
        title: "Poster Design - Masking in Photoshop",
        description: "In this video, I'll show you how to create a creative poster design in Photoshop.",
      },
      {
        id: "61mkx_OV61s",
        title: "Photoshop Tutorial for Beginners 2022 | Everything You NEED to KNOW!",
        description: "In today's video I show you everything you need to know as a beginner about photoshop cc photo editing in 2021/2022.",
      },
      {
        id: "lRrzHeNeaFk",
        title: "How to Make Creative Poster Design in Photoshop",
        description: "Create a sports poster using Adobe Photoshop.",
      },
      {
        id: "TN_vWXLu9YQ",
        title: "Giant Buffalo-Photoshop Manipulation Speed Art Tutorial",
        description: "Learn how to make Cinematic Giant Buffalo Manipulation scene in Photoshop CC 2020.",
      },
      {
        id: "ncfyq6AvPRk",
        title: "The best Photoshop plugin I've ever used",
        description: "The best Photoshop plugin",
      },
      {
        id: "sMPcumZJZcI",
        title: "ARTIST vs PHOTOSHOP AI - Are We Being Replaced?",
        description: "In today's video we're experimenting with Photoshop Generative Fill and Adobe Firefly to see what's possible.",
      },
      {
        id: "Gv9QH0Z-GMU",
        title: "Orange tutorial in Adobe Illustrator - 1 minute tutorial for beginner",
        description: "Orange tutorial in Adobe Illustrator",
      },
      {
        id: "qzwd6T5RHL0",
        title: "Illustrator Tutorial : How To Create Beautiful Floral Vector in Illustrator Using Blend Tool",
        description: "How To Create Beautiful Floral Vector in Illustrator Using Blend Tool ",
      },
      {
        id: "uDidXWIf2Fk",
        title: "How to Make 3D Distorted Graffiti Bubble Text in Illustrator",
        description: "This tutorial is all about distorting the already given bubble font and fully customizing it to the edge till you get some crazy results.",
      },
      {
        id: "Q0QOqJvhRm4",
        title: "30 Illustrator Secrets Graphic Designers MUST KNOW!",
        description: "This tutorial will demonstrate 30 tips, tools and features to help you get the most out of Adobe Illustrator.",
      },
      {
        id: "Ke9AswrXsLo",
        title: "CREATE A SICK POSTER IN ILLUSTRATOR & PHOTOSHOP",
        description: "In this tutorial, we will learn how to make a retro-futuristic poster design in illustrator and photoshop.",
      },
      {
        id: "4s_dWk62Kwo",
        title: "9 More Hacks Pro Designers Use in Adobe Illustrator",
        description: "This video will demonstrate 9 legendary hacks that pro designers use in Adobe Illustrator.",
      },
      {
        id: "v329NOX2xq8",
        title: "Illustrator 2024 New Features - Don't Miss These!",
        description: "Adobe Illustrator 2024 has dropped, and these are the new features you need to know about, to get the most out of this update!",
      },
      {
        id: "zi07oi9PlY0",
        title: "Expand Photos & Remove Objects with Generative AI in Lightroom & Photoshop on iPad | Adobe",
        description: "Explore the power of Generative Expand and Generative Fill as part of your Lightroom editing workflow with Lightroom Product Manager Matt Rae in this tutorial.",
      },
      {
        id: "aPSyhfVXXf8",
        title: "ZÁKLADNÍ ÚPRAVY FOTEK V LIGHTROOM!",
        description: "Video, o které jste si nejvíc skoro psali je konečně tady! Jak obecně upravuji fotky pomocí Lightroom.",
      },
      {
        id: "NQHHinjgHHs",
        title: "LIGHTROOM PRO ZAČÁTEČNÍKY",
        description: "Rozhodl jsem se udělat video, kde ukážu program na úpravu fotek Lightroom od Adobe.",
      },
      {
        id: "7f9Go3yHFp8",
        title: "Incredible Lightroom Technique I Can’t Stop Using!",
        description: "Lightroom Technique",
      },
      {
        id: "y5HGHa-X6Fw",
        title: "Lightroom Photo Editing // Moody Night Street Photography",
        description: "Moody Night Photography? Yes Please! Follow along with this Lightroom edit and learn some tricks and techniques you can use when editing your photos!",
      },
    ];

    const handlePlay = (videoId) => {
      setSelectedVideo(videoId === selectedVideo ? null : videoId);
    };
  
    useEffect(() => {
      // Simulating loading delay with setTimeout
      const timeout = setTimeout(() => {
        setLoading(false); // Set loading to false after timeout
      }, 3000); // Simulate 3 seconds loading time
  
      // Clear timeout on component unmount to avoid memory leaks
      return () => clearTimeout(timeout);
    }, []);
    
      return (
        <div>
          {loading ? (
            // Render loading screen until all videos are loaded
            <LoadingScreen />
          ) : (
            <div>
                <div className="page-name-containerVI">
            <div className="page-nameVI">ZochovaArt</div>
            <div className="circle-behind-tVI"></div>
          </div>
          <div className="title-container">
            <p className="title-text">Welcome to Tutorials</p>
            <p className="description-text">
              Explore the art of photo creation, editing, and drawing through a curated selection of videos from YouTube. Whether you're a beginner or a seasoned photographer, join others on this enriching journey to unlock the full potential of your creativity.
            </p>
          </div>
              <div className="videos-container">
                {videosData.map((video) => (
                  <div
                    key={video.id}
                    className={`video-card ${selectedVideo === video.id ? 'selected' : ''}`}
                    onClick={() => handlePlay(video.id)}
                  >
                    <iframe
                      title={video.title}
                      src={`https://www.youtube.com/embed/${video.id}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      <p>{video.description}</p>
                      <div className="click-for-bigger">
                        <span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/")} className="button-homeVI">
                Home
              </button>
            </div>
          )}
        </div>
      );
    }
    
    export default Videos;