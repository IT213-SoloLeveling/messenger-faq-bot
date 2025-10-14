// server.js
import express from "express";
import bodyParser from "body-parser";
import request from "request";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// ✅ Verify webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle messages
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];
      const sender = event.sender.id;
      if (event.message && event.message.text) {
        handleMessage(sender, event.message.text);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Language detection functions
function detectBisaya(text) {
  const bisayaKeywords = [
    'kumusta', 'musta', 'kamusta', 'unsa', 'asa', 'kanus-a', 'ngano', 'ngano',
    'kinsa', 'kinsay', 'kinsa ang', 'unsaon', 'pila', 'kanus-a', 'asa ka',
    'programa', 'kurso', 'trabaho', 'trabahoan', 'kinahanglan', 'thesis',
    'partnership', 'event', 'training', 'cost', 'academic', 'develop'
  ];
  return bisayaKeywords.some(keyword => text.includes(keyword));
}

function detectTagalog(text) {
  const tagalogKeywords = [
    'kumusta', 'kamusta', 'ano', 'saan', 'kailan', 'bakit', 'sino', 'sino ang',
    'paano', 'ilan', 'kailan', 'saan ka', 'programa', 'kurso', 'trabaho',
    'trabahoan', 'kailangan', 'thesis', 'partnership', 'event', 'training',
    'cost', 'academic', 'develop', 'mga', 'ang', 'ng', 'sa', 'ay'
  ];
  return tagalogKeywords.some(keyword => text.includes(keyword));
}

function handleMessage(sender_psid, text) {
  let response;

  text = text.toLowerCase();

  // Detect language preference
  const isBisaya = detectBisaya(text);
  const isTagalog = detectTagalog(text);

  // Welcome message
  if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("start") || 
      text.includes("kumusta") || text.includes("kumusta ka") || text.includes("musta") ||
      text.includes("kamusta") || text.includes("kamusta ka")) {
    
    if (isBisaya) {
      response = { 
        text: "Kumusta! Ako si Hestia, ang inyong Tourism & Hospitality Department assistant. Unsaon ko ninyo matabang karon? 👋\n\nMga paspas nga pangutana:\n• Sultihi ko bahin sa mga programa\n• Unsa ang mga industry partnerships?\n• Unsa ang mga events ug competitions?\n• Unsa ang practical training?\n• Unsa ang mga extra costs?\n• Unsa ang academic content?\n• Unsa ang mga trabaho nga makakuha nako?\n• Kinahanglan ba ko mag-thesis?\n• Kinsa ang nag-develop niini?"
      };
    } else if (isTagalog) {
      response = { 
        text: "Kumusta! Ako si Hestia, ang inyong Tourism & Hospitality Department assistant. Paano ko kayo matutulungan ngayon? 👋\n\nMabilis na mga tanong:\n• Sabihin mo sa akin ang mga programa\n• Ano ang mga industry partnerships?\n• Ano ang mga events at competitions?\n• Ano ang practical training?\n• Ano ang mga extra costs?\n• Ano ang academic content?\n• Ano ang mga trabaho na makukuha ko?\n• Kailangan ba ako mag-thesis?\n• Sino ang nag-develop nito?"
      };
    } else {
      response = { 
        text: "Hello! I'm Hestia, your Tourism & Hospitality Department assistant. How can I help you today? 👋\n\nQuick Questions:\n• Tell me about the programs\n• What are the industry partnerships?\n• What events and competitions are there?\n• What practical training is included?\n• What are the extra costs?\n• What's the academic content like?\n• What jobs can I get?\n• Do I need to do a thesis?\n• Who developed this?"
      };
    }
  } 
  // Programs offered
  else if (text.includes("program") || text.includes("bstm") || text.includes("bshm") || text.includes("course") || text.includes("degree") ||
           text.includes("programa") || text.includes("kurso")) {
    
    if (isBisaya) {
      response = { 
        text: "Adunay duha ka programa:\n\n🏛️ **BSTM – Bachelor of Science in Tourism Management**\nNakafocus sa airlines, travel agencies, tour guiding, events, ug destinations.\n\n🏨 **BSHM – Bachelor of Science in Hospitality Management**\nNakafocus sa hotels, restaurants, cooking, events, ug customer service."
      };
    } else if (isTagalog) {
      response = { 
        text: "May dalawang programa:\n\n🏛️ **BSTM – Bachelor of Science in Tourism Management**\nNakatuon sa airlines, travel agencies, tour guiding, events, at destinations.\n\n🏨 **BSHM – Bachelor of Science in Hospitality Management**\nNakatuon sa hotels, restaurants, cooking, events, at customer service."
      };
    } else {
      response = { 
        text: "We offer two programs:\n\n🏛️ **BSTM – Bachelor of Science in Tourism Management**\nFocuses on airlines, travel agencies, tour guiding, events, and destinations.\n\n🏨 **BSHM – Bachelor of Science in Hospitality Management**\nFocuses on hotels, restaurants, cooking, events, and customer service."
      };
    }
  } 
  // Industry partnerships
  else if (text.includes("partnership") || text.includes("industry") || text.includes("partner") || text.includes("company")) {
    
    if (isBisaya) {
      response = { 
        text: "Oo! Adunay partnerships sa **Air Asia** ug daghan pang ubang industry leaders:\n\n• Bayfront Cebu\n• Bohol Bee Farm\n• Discovery Prime Makati\n• Department of Tourism Manila Philippines\n• Ecoscape Travel & Tours\n• Fuente Pension House\n• Fuente Hotel de Cebu\n• Hotel Celeste Makati\n• Jeju Air\n• Kinglyahan Forest Park\n• Kyle's Restaurant\n• La Carmela de Boracay\n• Marina Sea View\n• Marzon Beach Resort, Boracay\n• Nustar Resort and Casino\n• Rio Verde Floating Restaurant\n• Tambuli Seaside Resort and Spa\n• The Mark Resort Cebu\n• Waterfront Mactan / Waterfront Lahug"
      };
    } else if (isTagalog) {
      response = { 
        text: "Oo! May partnerships sa **Air Asia** at marami pang ibang industry leaders:\n\n• Bayfront Cebu\n• Bohol Bee Farm\n• Discovery Prime Makati\n• Department of Tourism Manila Philippines\n• Ecoscape Travel & Tours\n• Fuente Pension House\n• Fuente Hotel de Cebu\n• Hotel Celeste Makati\n• Jeju Air\n• Kinglyahan Forest Park\n• Kyle's Restaurant\n• La Carmela de Boracay\n• Marina Sea View\n• Marzon Beach Resort, Boracay\n• Nustar Resort and Casino\n• Rio Verde Floating Restaurant\n• Tambuli Seaside Resort and Spa\n• The Mark Resort Cebu\n• Waterfront Mactan / Waterfront Lahug"
      };
    } else {
      response = { 
        text: "Yes! We have partnerships with **Air Asia** and many other industry leaders:\n\n• Bayfront Cebu\n• Bohol Bee Farm\n• Discovery Prime Makati\n• Department of Tourism Manila Philippines\n• Ecoscape Travel & Tours\n• Fuente Pension House\n• Fuente Hotel de Cebu\n• Hotel Celeste Makati\n• Jeju Air\n• Kinglyahan Forest Park\n• Kyle's Restaurant\n• La Carmela de Boracay\n• Marina Sea View\n• Marzon Beach Resort, Boracay\n• Nustar Resort and Casino\n• Rio Verde Floating Restaurant\n• Tambuli Seaside Resort and Spa\n• The Mark Resort Cebu\n• Waterfront Mactan / Waterfront Lahug"
      };
    }
  } 
  // Events and competitions
  else if (text.includes("event") || text.includes("competition") || text.includes("contest") || text.includes("activity")) {
    
    if (isBisaya) {
      response = { 
        text: "Oo! Ang department nag-organize og multi-day event nga adunay competitions sama sa **bartending, market basket, tray relay, housekeeping, airline voice over, tour guiding/vlogging, ug hair & makeup**. 🏆"
      };
    } else if (isTagalog) {
      response = { 
        text: "Oo! Ang department ay nag-organize ng multi-day event na may competitions tulad ng **bartending, market basket, tray relay, housekeeping, airline voice over, tour guiding/vlogging, at hair & makeup**. 🏆"
      };
    } else {
      response = { 
        text: "Yes! The department organizes a multi-day event featuring competitions like **bartending, market basket, tray relay, housekeeping, airline voice over, tour guiding/vlogging, and hair & makeup**. 🏆"
      };
    }
  } 
  // Practical training
  else if (text.includes("training") || text.includes("practical") || text.includes("internship") || text.includes("ojt")) {
    
    if (isBisaya) {
      response = { 
        text: "Labs ug simulations sa duha ka programa, plus internships pinaagi sa industry partners aron makakuha mo og real-world experience sa professional environments. 💼"
      };
    } else if (isTagalog) {
      response = { 
        text: "Labs at simulations sa dalawang programa, plus internships sa pamamagitan ng industry partners upang makakuha kayo ng real-world experience sa professional environments. 💼"
      };
    } else {
      response = { 
        text: "Labs and simulations in both programs, plus internships via industry partners to give you real-world experience in professional environments. 💼"
      };
    }
  } 
  // Extra costs
  else if (text.includes("cost") || text.includes("expense") || text.includes("fee") || text.includes("money") || text.includes("price") ||
           text.includes("gasto") || text.includes("bayad") || text.includes("kwarta")) {
    
    if (isBisaya) {
      response = { 
        text: "Additional expenses para sa **Lab Uniform, culinary ingredients, Event participation fees (MICE), ug OJT requirements**. 💰"
      };
    } else if (isTagalog) {
      response = { 
        text: "Karagdagang gastos para sa **Lab Uniform, culinary ingredients, Event participation fees (MICE), at OJT requirements**. 💰"
      };
    } else {
      response = { 
        text: "Additional expenses for **Lab Uniform, culinary ingredients, Event participation fees (MICE), and OJT requirements**. 💰"
      };
    }
  } 
  // Academic content
  else if (text.includes("academic") || text.includes("content") || text.includes("subject") || text.includes("study") || text.includes("curriculum")) {
    
    if (isBisaya) {
      response = { 
        text: "Heavy sa memorization (maps, cultures), system use sama sa **Amadeus, Property Management System (PMS)**, ug event planning (MICE). 📚"
      };
    } else if (isTagalog) {
      response = { 
        text: "Mabigat sa memorization (maps, cultures), system use tulad ng **Amadeus, Property Management System (PMS)**, at event planning (MICE). 📚"
      };
    } else {
      response = { 
        text: "Heavy on memorization (maps, cultures), system use like **Amadeus, Property Management System (PMS)**, and event planning (MICE). 📚"
      };
    }
  } 
  // Career opportunities
  else if (text.includes("job") || text.includes("career") || text.includes("graduate") || text.includes("work") || text.includes("employment") ||
           text.includes("trabaho") || text.includes("trabahoan")) {
    
    if (isBisaya) {
      response = { 
        text: "**BSTM graduates makahimong:**\n• Travel o tour agents\n• Flight attendants\n• Tourism officers\n• Event organizers\n\n**BSHM graduates makahimong:**\n• Hotel o resort managers\n• Chefs o kitchen supervisors\n• Front desk managers\n• F&B supervisors"
      };
    } else if (isTagalog) {
      response = { 
        text: "**BSTM graduates ay maaaring maging:**\n• Travel o tour agents\n• Flight attendants\n• Tourism officers\n• Event organizers\n\n**BSHM graduates ay maaaring maging:**\n• Hotel o resort managers\n• Chefs o kitchen supervisors\n• Front desk managers\n• F&B supervisors"
      };
    } else {
      response = { 
        text: "**BSTM graduates can become:**\n• Travel or tour agents\n• Flight attendants\n• Tourism officers\n• Event organizers\n\n**BSHM graduates can become:**\n• Hotel or resort managers\n• Chefs or kitchen supervisors\n• Front desk managers\n• F&B supervisors"
      };
    }
  } 
  // Thesis requirement
  else if (text.includes("thesis") || text.includes("research") || text.includes("project")) {
    
    if (isBisaya) {
      response = { 
        text: "Oo, kasagaran sa inyong **3rd o 4th year** makompleto ninyo ang thesis o research project isip bahin sa inyong degree requirements. 📝"
      };
    } else if (isTagalog) {
      response = { 
        text: "Oo, kadalasan sa inyong **3rd o 4th year** makakumpleto kayo ng thesis o research project bilang bahagi ng inyong degree requirements. 📝"
      };
    } else {
      response = { 
        text: "Yes, usually in your **3rd or 4th year** you'll complete a thesis or research project as part of your degree requirements. 📝"
      };
    }
  } 
  // Developer information
  else if (text.includes("develop") || text.includes("create") || text.includes("who") || text.includes("made") || text.includes("author") ||
           text.includes("kinsa") || text.includes("sino")) {
    
    if (isBisaya) {
      response = { 
        text: "Kini nga chatbot gihimo sa **Group AUZA**, usa ka team sa 4th-year BSIT students:\n\n• Francisco Dag-uman\n• Martin John Bacho\n• Ryan Galano\n• Ramsil Calapre"
      };
    } else if (isTagalog) {
      response = { 
        text: "Ang chatbot na ito ay ginawa ng **Group AUZA**, isang team ng 4th-year BSIT students:\n\n• Francisco Dag-uman\n• Martin John Bacho\n• Ryan Galano\n• Ramsil Calapre"
      };
    } else {
      response = { 
        text: "This chatbot was created by **Group AUZA**, a team of 4th-year BSIT students:\n\n• Francisco Dag-uman\n• Martin John Bacho\n• Ryan Galano\n• Ramsil Calapre"
      };
    }
  } 
  // Thank you responses
  else if (text.includes("thank") || text.includes("thanks") || text.includes("salamat") || text.includes("salamat kaayo")) {
    
    if (isBisaya) {
      response = { 
        text: "Walay sapayan! Kanunay ko dinhi aron matabangan mo sa bisan unsang pangutana bahin sa among Tourism & Hospitality programs. Libre lang mo mangutana! 😊"
      };
    } else if (isTagalog) {
      response = { 
        text: "Walang anuman! Palagi akong nandito upang matulungan kayo sa anumang tanong tungkol sa aming Tourism & Hospitality programs. Magsalita lang kayo! 😊"
      };
    } else {
      response = { 
        text: "You're welcome! I'm always here to help you with any questions about our Tourism & Hospitality programs. Feel free to ask me anything! 😊"
      };
    }
  } 
  // Location
  else if (text.includes("location") || text.includes("where") || text.includes("address") || text.includes("asa") || text.includes("saan")) {
    
    if (isBisaya) {
      response = { 
        text: "Naa mi sa Saint Joseph College, Maasin City. 📍"
      };
    } else if (isTagalog) {
      response = { 
        text: "Nandito kami sa Saint Joseph College, Maasin City. 📍"
      };
    } else {
      response = { 
        text: "We're located at Saint Joseph College, Maasin City. 📍"
      };
    }
  } 
  // BSTM curriculum details
  else if (text.includes("bstm") && (text.includes("curriculum") || text.includes("course") || text.includes("subject"))) {
    
    if (isBisaya) {
      response = { 
        text: "Ang BSTM curriculum naglakip sa comprehensive courses nga nag-cover sa tourism management, airline operations, travel agency management, tour guiding techniques, event planning, destination management, ug cultural studies. Palihug kontaka ang department para sa complete curriculum details. 📋"
      };
    } else if (isTagalog) {
      response = { 
        text: "Ang BSTM curriculum ay may kasamang comprehensive courses na sumasaklaw sa tourism management, airline operations, travel agency management, tour guiding techniques, event planning, destination management, at cultural studies. Pakikontak ang department para sa complete curriculum details. 📋"
      };
    } else {
      response = { 
        text: "The BSTM curriculum includes comprehensive courses covering tourism management, airline operations, travel agency management, tour guiding techniques, event planning, destination management, and cultural studies. Please contact the department for the complete curriculum details. 📋"
      };
    }
  } 
  // Default response
  else {
    
    if (isBisaya) {
      response = { 
        text: "Salamat sa inyong pangutana! Naa ko dinhi aron matabangan mo sa pagkat-on bahin sa among Tourism & Hospitality programs sa Saint Joseph College. Unsa pa ang akong matabang?\n\nSulayi pangutana bahin sa:\n• Mga programa nga gihatag\n• Industry partnerships\n• Events ug competitions\n• Practical training\n• Career opportunities"
      };
    } else if (isTagalog) {
      response = { 
        text: "Salamat sa inyong tanong! Nandito ako upang matulungan kayo sa pag-aaral tungkol sa aming Tourism & Hospitality programs sa Saint Joseph College. Ano pa ang aking matutulong?\n\nSubukan magtanong tungkol sa:\n• Mga programa na inaalok\n• Industry partnerships\n• Events at competitions\n• Practical training\n• Career opportunities"
      };
    } else {
      response = { 
        text: "Thank you for your question! I'm here to help you learn more about our Tourism & Hospitality programs at Saint Joseph College. How else can I assist you?\n\nTry asking about:\n• Programs offered\n• Industry partnerships\n• Events and competitions\n• Practical training\n• Career opportunities"
      };
    }
  }

  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: { id: sender_psid },
    message: response,
  };

  request(
    {
      uri: "https://graph.facebook.com/v19.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err) => {
      if (err) console.error("❌ Unable to send message: " + err);
    }
  );
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Bot server running on port ${PORT}`));

