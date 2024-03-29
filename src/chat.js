import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import styles from './chat.module.css';
import { API_BASE_URL } from './config';

function App({userid}) {
    const [displayChat, setDisplayChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationID, setConversationID] = useState(0);
    const [newMessageContent, setNewMessageContent] = useState('');
    const messagesEndRef = useRef(null);
    
    console.log("CART" + userid);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const createConversation = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/Chat/CreateConversation?userID=${userid}`, {
            method: 'POST', // Assuming POST is the correct method for this endpoint
            headers: {
              'Content-Type': 'application/json',
            },
            // If the body is needed, include it here as JSON. Omit if not necessary.
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok when trying to create a conversation');
          }
      
          const newConversationData = await response.json();
          console.log("NEW INFOOOOO " + newConversationData)
          setConversationID(newConversationData.id); // Assuming the response includes the ID of the new conversation
          // Now that the conversation is created, you can fetch messages for it
          fetchMessages();
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      };

    const changeChatVisibility = () => {
        if (userid < 1)
        {
            window.location.reload();
        }
        setDisplayChat(!displayChat);
    }
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, displayChat]); // Dependency on messages means this runs whenever messages change
    
    const fetchMessages = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${API_BASE_URL}/Chat/GetConversationByUser?userID=` + userid);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setConversationID(data.id);
                // Assuming 'data.messages' is an array of message objects
    
                // Sort messages by dateTime in ascending order so the oldest is first
                const sortedMessages = data.messages.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
                setMessages(sortedMessages.map((msg, index) => ({
                    id: index + 1, // Unique ID for the message
                    senderID: msg.senderID, // Assuming there is a senderID field
                    sentFromStaff: msg.isStaff,
                    content: msg.messageText,
                    dateTime: msg.dateTime // Including the dateTime to keep track of it
                })));
    
                resolve(); // Resolve the promise after successfully setting the conversation ID and messages
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                reject(error); // Reject the promise if there was an error
            }
        });
    };


        // Function to add a new message (for demonstration, this adds a predefined message)
        const addNewMessage = async () => {
            if (conversationID == 0) {
                await fetchMessages();
                console.log(conversationID); // This should now log a non-zero ID
            }
            // Prepare the message data
            const newMessage = {
                conversationID: conversationID, 
                messageText: newMessageContent,
                isStaff: false, 
                dateTime: new Date().toISOString()
            };

            if (newMessageContent.length < 1)
            {
                return;
            }
    
            try {
                const response = await fetch(`${API_BASE_URL}/Chat/AddMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMessage),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                // Clear the input after sending the message
                setNewMessageContent('');
    
                // Optionally fetch messages again to include the new one
                fetchMessages();
    
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };
    
        // Function to handle input change
        const handleInputChange = (e) => {
            setNewMessageContent(e.target.value);
        };
    
    if (displayChat)
    {
        return (
            <div className={styles.chat}>
                <div onClick={changeChatVisibility} className={styles.minimize}> </div>
                <div className={styles.header}>
                    <div className={styles.image}><img src={`${process.env.PUBLIC_URL}/images/logo.jpg`}/></div>
                    <div className={styles.text}><h2>1001GOLD</h2>
                    <a>чат със support</a></div>
                </div>
    
                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div key={message.id} className={message.sentFromStaff ? styles.staffMessage : styles.userMessage}>
                            <a>{message.content}</a>
                        </div>
                    ))}
                <div ref={messagesEndRef} />
    
                </div>
    
                <div className={styles.sendMessageBack}>
                    <div className={styles.sendMessage}>
                        <textarea value={newMessageContent} onChange={handleInputChange} />
                        <img src={`${process.env.PUBLIC_URL}/images/sendIcon.png`} onClick={addNewMessage} />
                    </div>
                </div>
            </div>
        )
    }

    else {
        return (
            <div onClick={() => {
                changeChatVisibility();
                createConversation(); // Call createConversation when the hiddenChat div is clicked
              }} className={styles.hiddenChat}></div>
        )
    }
    
}

export default App;