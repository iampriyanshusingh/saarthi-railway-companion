const express = require('express');
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Groq client
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

// Railway station context for AI responses
const STATION_CONTEXT = `
You are Saarthi, a helpful AI assistant for a railway station. You help passengers with:

1. Station Navigation: Provide directions to platforms, facilities, and amenities
2. Train Information: Share details about train schedules, delays, and platform changes
3. Station Facilities: Information about restrooms, food courts, waiting areas, ATMs, etc.
4. Accessibility Services: Help with wheelchair assistance, elderly support, and special needs
5. General Assistance: Lost and found, emergency contacts, station policies

Station Layout:
- Platform 1: Located at coordinates (300, 50) - Long distance trains
- Platform 2: Located at coordinates (300, 150) - Express trains  
- Platform 3: Located at coordinates (300, 250) - Local trains
- Food Court: Located at coordinates (150, 200) - Multiple dining options
- Restrooms: Men's at (100, 150), Women's at (120, 150)
- Information Desk: Located at coordinates (200, 100)
- Ticket Counter: Located at coordinates (50, 100)
- ATM: Located at coordinates (250, 150)
- Pharmacy: Located at coordinates (180, 250)

Always be helpful, concise, and provide specific directions when asked. If you don't know something specific, offer to help the user contact station staff or direct them to the information desk.
`;

// Mock responses for when Groq is not available
const getMockResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('platform') || lowerMessage.includes('train')) {
    return "I can help you find the right platform! Platform 1 is for long-distance trains, Platform 2 for express trains, and Platform 3 for local trains. All platforms are accessible via the main concourse. Would you like directions to a specific platform?";
  }
  
  if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
    return "Our Food Court is located in the central area of the station at coordinates (150, 200). It has multiple dining options including fast food, traditional meals, and beverages. It's open 24/7 and easily accessible from all platforms.";
  }
  
  if (lowerMessage.includes('restroom') || lowerMessage.includes('toilet') || lowerMessage.includes('bathroom')) {
    return "Restrooms are conveniently located near the center of the station. Men's restroom is at (100, 150) and Women's restroom is at (120, 150). Both are wheelchair accessible and well-maintained.";
  }
  
  if (lowerMessage.includes('ticket') || lowerMessage.includes('booking')) {
    return "The Ticket Counter is located at (50, 100) near the main entrance. You can book tickets, make reservations, and get assistance with cancellations. For faster service, you can also use the online booking kiosks available throughout the station.";
  }
  
  if (lowerMessage.includes('atm') || lowerMessage.includes('money') || lowerMessage.includes('cash')) {
    return "There's an ATM located at (250, 150) near the main waiting area. It accepts all major bank cards and is available 24/7. If you need additional banking services, there are more ATMs near the food court.";
  }
  
  if (lowerMessage.includes('wheelchair') || lowerMessage.includes('accessibility') || lowerMessage.includes('disabled')) {
    return "Our station is fully wheelchair accessible! All platforms have ramps and elevators. If you need wheelchair assistance, you can request it through the app or contact our staff at the Information Desk (200, 100). We also have accessible restrooms and designated seating areas.";
  }
  
  if (lowerMessage.includes('lost') || lowerMessage.includes('found')) {
    return "For lost and found items, please visit the Information Desk at (200, 100). Our staff maintains a comprehensive lost and found database. You can also report lost items through the app, and we'll notify you if they're found.";
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
    return "For emergencies, immediately contact station security at the Information Desk (200, 100) or use the emergency call buttons located throughout the station. For medical emergencies, we have a pharmacy at (180, 250) and can call medical assistance if needed.";
  }
  
  if (lowerMessage.includes('direction') || lowerMessage.includes('navigate') || lowerMessage.includes('where')) {
    return "I'd be happy to help you navigate the station! Could you tell me where you're currently located and where you'd like to go? I can provide step-by-step directions to any platform, facility, or amenity in the station.";
  }
  
  return "Hello! I'm Saarthi, your railway station assistant. I can help you with directions, train information, station facilities, and accessibility services. What would you like to know about the station today?";
};

// Chat endpoint
router.post('/message',  async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let response;

    if (groq) {
      try {
        // Prepare conversation history for Groq
        const messages = [
          {
            role: 'system',
            content: STATION_CONTEXT
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: message
          }
        ];

        const completion = await groq.chat.completions.create({
          model: 'llama3-70b-8192', // or another Llama model available on Groq
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        });

        response = completion.choices[0].message.content;

      } catch (groqError) {
        console.error('Groq API error:', groqError);
        // Fallback to mock response if Groq fails
        response = getMockResponse(message);
      }
    } else {
      // Use mock response when Groq is not configured
      response = getMockResponse(message);
    }

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing chat message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat suggestions
router.get('/suggestions', auth, async (req, res) => {
  try {
    const suggestions = [
      "Where is Platform 2?",
      "How do I get to the food court?",
      "Where are the restrooms?",
      "I need wheelchair assistance",
      "What trains are departing soon?",
      "Where can I buy tickets?",
      "Is there an ATM nearby?",
      "I lost my bag, what should I do?",
      "How do I get to the parking area?",
      "What facilities are available for elderly passengers?"
    ];

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get conversation starters based on user context
router.get('/starters', auth, async (req, res) => {
  try {
    const { location, userType } = req.query;
    
    let starters = [
      "Hi! How can I help you navigate the station today?",
      "Welcome to Central Railway Station! What information do you need?",
      "I'm here to assist you with directions and station services."
    ];

    // Customize based on location or user type
    if (location === 'entrance') {
      starters = [
        "Welcome! Where would you like to go in the station?",
        "Need directions to a platform or facility?",
        "I can help you find tickets, platforms, or amenities."
      ];
    } else if (location === 'platform') {
      starters = [
        "Are you looking for train information or need to get somewhere else?",
        "Need help with connections or station facilities?",
        "I can provide real-time train updates and directions."
      ];
    }

    res.json({
      success: true,
      starters
    });

  } catch (error) {
    console.error('Starters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversation starters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;



