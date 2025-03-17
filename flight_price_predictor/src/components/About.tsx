import React from 'react';
import "./About.css"

const About: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">About Flight Price Predictor</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                <p className="mb-4">
                    Flight Price Predictor is an innovative application that uses advanced machine learning algorithms 
                    to predict flight prices based on various factors such as departure date, destination, 
                    airline, and more. Our goal is to help travelers find the best time to book their flights 
                    and save money.
                </p>
                <p>
                    By analyzing historical pricing data and patterns, our predictor provides reliable estimates 
                    for future flight costs, helping you make informed decisions about your travel plans.
                </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Enter your flight details including origin, destination, and travel dates</li>
                    <li>Our machine learning model processes your request</li>
                    <li>Receive accurate price predictions with confidence intervals</li>
                    <li>Use our price trend analysis to determine the best time to book</li>
                </ol>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
                <p className="mb-4">
                    This application is built using a combination of modern technologies:
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Frontend: React with TypeScript and CSS</li>
                    <li>Backend: Python with FastAPI</li>
                    <li>Machine Learning: Advanced regression models trained on extensive flight data</li>
                    <li>Data Processing: Real-time data processing and analysis pipelines</li>
                </ul>
            </div>
        </div>
    );
};

export default About;