import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I\'m your AI flight assistant. I can help you find the best time to book your flights, suggest destinations based on your preferences, or answer questions about travel trends. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample suggestions for the user
  const suggestions = [
    "When is the cheapest time to fly to Europe?",
    "How far in advance should I book domestic flights?",
    "Will flight prices drop closer to my travel date?",
    "What day of the week is best to book flights?",
    "How do airline miles affect my booking strategy?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        "when is the cheapest time to fly to europe?": "Based on historical data, the cheapest time to fly to Europe is typically during the off-season (October to March, excluding holidays). January tends to be the least expensive month, with prices approximately 36% lower than peak summer rates. I recommend booking 4-6 months in advance for optimal pricing.",
        "how far in advance should i book domestic flights?": "For domestic flights in the U.S., our data suggests booking 3-4 weeks in advance for the best prices. Booking too early (more than 6 months) or too late (less than 1 week) typically results in higher prices. For holiday travel, extend your booking window to 2-3 months in advance.",
        "will flight prices drop closer to my travel date?": "While last-minute deals do occasionally happen, our data shows that flight prices typically increase as the departure date approaches, especially in the final 2 weeks. Airlines know that last-minute bookers are often business travelers or have urgent needs and are willing to pay premium prices.",
        "what day of the week is best to book flights?": "While there's a popular belief that Tuesday is the best day to book, our analysis shows only a small average difference (<2%) between booking days. What matters more is how far in advance you book and the travel dates. If you're flexible, flying on Tuesday or Wednesday can save you 15-20% compared to weekend flights.",
        "how do airline miles affect my booking strategy?": "When using airline miles, booking strategies differ from cash purchases. Award seats typically become available 11 months before the flight and the best availability is often found at that time. Unlike cash tickets, award tickets don't typically follow the same pricing patterns throughout the year.",
      };

      // Check if we have a predefined response for this query
      let responseText = '';
      const userQuery = input.toLowerCase().trim();
      
      if (botResponses[userQuery]) {
        responseText = botResponses[userQuery];
      } else {
        // Generic response for other queries
        responseText = "That's a great question. Based on our flight data analysis, prices typically fluctuate based on demand, seasonality, and how far in advance you book. For most destinations, booking 4-8 weeks ahead usually offers the best value, but this can vary depending on your specific route and travel dates. Would you like me to analyze a specific route or time period for you?";
      }

      const botMessage: Message = {
        id: (Date.now() + 100).toString(),
        type: 'bot',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>AI Travel Assistant</h2>
        <p>Ask me anything about flight prices, booking strategies, or travel trends</p>
      </div>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot typing">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="suggestions-container">
          <h4>Suggested Questions</h4>
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <button 
                key={index} 
                className="suggestion" 
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask about flight prices, trends, or booking strategies..."
            value={input}
            onChange={handleInputChange}
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !input.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="send-icon">
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;