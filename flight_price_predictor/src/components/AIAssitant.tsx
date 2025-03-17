import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';
import OpenAI from 'openai';

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

  const callOpenAI = async (userMessage: string) => {
    try {
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use React env variable naming
        dangerouslyAllowBrowser: true // Enable browser usage (for development/demo only)
      });
      
      // Get previous messages for context (excluding initial greeting)
      const messageHistory = messages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
      
      // Add current message
      messageHistory.push({
        role: 'user' as const,
        content: userMessage
      });

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          // System message to provide context and role
          {
            role: "system" as const,
            content: "You are a helpful flight booking assistant for FlightSavvy. You provide advice on the best times to book flights, price trends, and travel strategies. Keep responses concise and focused on flight booking advice. Respond in a friendly, helpful tone."
          },
          ...messageHistory
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // Get response from OpenAI
      const responseText = await callOpenAI(input);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 100).toString(),
        type: 'bot',
        text: responseText || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 100).toString(),
        type: 'bot',
        text: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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