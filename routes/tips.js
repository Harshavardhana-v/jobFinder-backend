const express = require('express');
const router = express.Router();

// Career tips data
const careerTips = [
    {
        id: 1,
        title: "Network Actively",
        tip: "80% of jobs are filled through networking. Attend industry events, connect on LinkedIn, and don't be afraid to reach out to professionals in your field.",
        category: "networking",
        icon: "people"
    },
    {
        id: 2,
        title: "Tailor Your Resume",
        tip: "Customize your resume for each job application. Use keywords from the job description to pass ATS systems and show you're the perfect fit.",
        category: "resume",
        icon: "description"
    },
    {
        id: 3,
        title: "Learn Continuously",
        tip: "Dedicate 30 minutes daily to learning new skills. Online courses, podcasts, and industry blogs can keep you competitive in the job market.",
        category: "skills",
        icon: "school"
    },
    {
        id: 4,
        title: "Follow Up",
        tip: "Always send a thank-you email within 24 hours after an interview. It shows professionalism and keeps you top of mind.",
        category: "interview",
        icon: "email"
    },
    {
        id: 5,
        title: "Build Your Brand",
        tip: "Your online presence matters. Keep your LinkedIn profile updated, share industry insights, and showcase your expertise through posts or articles.",
        category: "branding",
        icon: "star"
    },
    {
        id: 6,
        title: "Practice Interview Skills",
        tip: "Record yourself answering common interview questions. This helps you identify areas for improvement and build confidence.",
        category: "interview",
        icon: "videocam"
    },
    {
        id: 7,
        title: "Set Career Goals",
        tip: "Define clear short-term and long-term career goals. Write them down and review them monthly to stay focused and motivated.",
        category: "motivation",
        icon: "flag"
    },
    {
        id: 8,
        title: "Research Companies",
        tip: "Before applying, research the company culture, values, and recent news. This knowledge helps you stand out in interviews.",
        category: "job_search",
        icon: "search"
    },
    {
        id: 9,
        title: "Optimize LinkedIn",
        tip: "Use a professional photo, write a compelling headline, and get recommendations. A complete profile gets 21x more views.",
        category: "networking",
        icon: "badge"
    },
    {
        id: 10,
        title: "Stay Positive",
        tip: "Job searching can be tough. Celebrate small wins, maintain a routine, and remember that rejection is redirection to something better.",
        category: "motivation",
        icon: "favorite"
    },
    {
        id: 11,
        title: "Quantify Achievements",
        tip: "Use numbers in your resume: 'Increased sales by 30%' is more impactful than 'Improved sales performance'.",
        category: "resume",
        icon: "trending_up"
    },
    {
        id: 12,
        title: "Ask Smart Questions",
        tip: "Prepare thoughtful questions for your interviewer. It shows genuine interest and helps you evaluate if the role is right for you.",
        category: "interview",
        icon: "help"
    },
    {
        id: 13,
        title: "Build a Portfolio",
        tip: "Create a portfolio showcasing your best work. Whether it's projects, designs, or writing samples, visual proof speaks volumes.",
        category: "skills",
        icon: "work"
    },
    {
        id: 14,
        title: "Time Management",
        tip: "Treat job searching like a job. Set daily goals, schedule applications, and take breaks to avoid burnout.",
        category: "job_search",
        icon: "schedule"
    },
    {
        id: 15,
        title: "Seek Feedback",
        tip: "Ask for feedback after rejections. Many recruiters appreciate the initiative and their insights can help you improve.",
        category: "job_search",
        icon: "feedback"
    },
    {
        id: 16,
        title: "Dress for Success",
        tip: "First impressions matter. Dress professionally for interviews, even if it's virtual. It boosts your confidence too!",
        category: "interview",
        icon: "checkroom"
    },
    {
        id: 17,
        title: "Use Job Alerts",
        tip: "Set up job alerts on multiple platforms. Being among the first applicants significantly increases your chances.",
        category: "job_search",
        icon: "notifications"
    },
    {
        id: 18,
        title: "Develop Soft Skills",
        tip: "Communication, teamwork, and problem-solving are highly valued. Practice these skills in every interaction.",
        category: "skills",
        icon: "psychology"
    },
    {
        id: 19,
        title: "Stay Updated",
        tip: "Follow industry trends and news. Being knowledgeable about your field makes you a more attractive candidate.",
        category: "skills",
        icon: "newspaper"
    },
    {
        id: 20,
        title: "Believe in Yourself",
        tip: "You have unique skills and experiences. Confidence in your abilities will shine through in applications and interviews.",
        category: "motivation",
        icon: "emoji_events"
    }
];

// @route   GET api/tips/daily
// @desc    Get 3 daily career tips (based on day of year)
// @access  Public
router.get('/daily', (req, res) => {
    try {
        // Get day of year to ensure same tips for the whole day
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        // Use day of year as a seed for consistent random selection
        const random = (seed) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        
        // Create a copy of tips to shuffle
        const shuffledTips = [...careerTips];
        
        // Fisher-Yates shuffle with seed
        for (let i = shuffledTips.length - 1; i > 0; i--) {
            const j = Math.floor(random(dayOfYear + i) * (i + 1));
            [shuffledTips[i], shuffledTips[j]] = [shuffledTips[j], shuffledTips[i]];
        }
        
        // Get first 3 unique tips
        const dailyTips = shuffledTips.slice(0, 3);
        
        res.json({
            success: true,
            tips: dailyTips,
            date: now.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error('Error fetching daily tips:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching daily tips' 
        });
    }
});

// @route   GET api/tips/random
// @desc    Get random career tip
// @access  Public
router.get('/random', (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * careerTips.length);
        const randomTip = careerTips[randomIndex];
        
        res.json({
            success: true,
            tip: randomTip
        });
    } catch (error) {
        console.error('Error fetching random tip:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching random tip' 
        });
    }
});

// @route   GET api/tips/category/:category
// @desc    Get tips by category
// @access  Public
router.get('/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const filteredTips = careerTips.filter(tip => tip.category === category);
        
        if (filteredTips.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'No tips found for this category' 
            });
        }
        
        res.json({
            success: true,
            tips: filteredTips,
            count: filteredTips.length
        });
    } catch (error) {
        console.error('Error fetching tips by category:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tips' 
        });
    }
});

// @route   GET api/tips/all
// @desc    Get all career tips
// @access  Public
router.get('/all', (req, res) => {
    try {
        res.json({
            success: true,
            tips: careerTips,
            count: careerTips.length
        });
    } catch (error) {
        console.error('Error fetching all tips:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tips' 
        });
    }
});

module.exports = router;
