import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import styles from './chat.module.css';
import logo from './images/logo.jpg';
import sendIcon from './images/sendIcon.png';



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
          const response = await fetch(`http://localhost:5104/Chat/CreateConversation?userID=${userid}`, {
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
          setConversationID(newConversationData.id); // Assuming the response includes the ID of the new conversation
          
          // Now that the conversation is created, you can fetch messages for it
          fetchMessages();
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      };

    const changeChatVisibility = () => {
        setDisplayChat(!displayChat);
    }
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, displayChat]); // Dependency on messages means this runs whenever messages change
    

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5104/Chat/GetConversationByUser?userID=' + userid);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setConversationID(data.id)
            // Assuming 'data.messages' is an array of message objects
            const sortedMessages = data.messages.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            setMessages(sortedMessages.map((msg, index) => ({
                id: index + 1, // Create a new id, because the ids might not be unique as shown in your initialMessages
                senderID: 'userid', // Assuming '7' is a placeholder for the actual senderID
                sentFromStaff: msg.isStaff,
                content: msg.messageText
            })));
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []); // Fetch messages only when the component is mounted


        // Function to add a new message (for demonstration, this adds a predefined message)
        const addNewMessage = async () => {
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
                const response = await fetch('http://localhost:5104/Chat/AddMessage', {
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
                    <div className={styles.image}><img src={logo}/></div>
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
                        <img src={sendIcon} onClick={addNewMessage} />
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