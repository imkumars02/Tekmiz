// src/App.js
import React, { useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';

function Converter() {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [formattedText, setFormattedText] = useState('');
    const [parsedText, setParsedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const apiKey = 'K82738723988957'; // Your OCR.space API key 

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleConvert = () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', image);
        formData.append('apikey', apiKey);

        fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.OCRExitCode === 1) {
                const text = data.ParsedResults[0].ParsedText;
                setText(text);
                formatAndParseText(text);
            } else {
                console.error('Error converting image to text:', data);
            }
        })
        .catch(error => {
            console.error('Error converting image to text:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const formatAndParseText = (text) => {
        // Extract text between "Member ID" and "Required"
        const memberIDIndex = text.indexOf('Member ID') + 'Member ID'.length;
        let leftText = text.substring(memberIDIndex).trim();
        
        // Remove text from "Required" onwards
        const requiredIndex = leftText.indexOf('Required');
        if (requiredIndex !== -1) {
            leftText = leftText.substring(0, requiredIndex).trim();
        }
        
        // Extract text between "Reset Status" and "Add Details"
        const resetStatusIndex = text.indexOf('Reset Status') + 'Reset Status'.length;
        let rightText = text.substring(resetStatusIndex).trim();
        
        // Remove text from "Add Details" onwards
        const addDetailsIndex = rightText.indexOf('Add Details');
        if (addDetailsIndex !== -1) {
            rightText = rightText.substring(0, addDetailsIndex).trim();
        }
        
        // Clean up extra spaces and new lines
        leftText = leftText.replace(/Member ID|Required/g, '').trim();
        rightText = rightText.replace(/Reset Status|Add Details/g, '').trim();
        
        // Split into lines
        const leftLines = leftText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        const rightLines = rightText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        
        const formattedLines = [];
        const parsedLines = [];
        
        // Match lengths
        const maxLines = Math.min(leftLines.length, rightLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            const id = leftLines[i];
            const code = rightLines[i];
            
            // Format lines
            formattedLines.push(`${id.padEnd(20)} ${code}`);
            
            // Parse text
            const parsedId = id.replace(/^GK00/, '');
            const [numericCode, stringCode] = code.split('-');
            // console.log(numericCode);
            // console.log(stringCode);
            parsedLines.push(`${parsedId}\n${stringCode}\n\n${numericCode}\n\n`); // Blank line is added here for separation
        }
        
        // Set formatted text
        setFormattedText(formattedLines.join('\n'));
        
        // Set parsed text
        setParsedText(parsedLines.join('\n').trim());
        
        // Optional: Assuming you want to log messages
        setMessages(parsedLines);
    };
    
    
    

    const handleTextChange = (index, newText) => {
        const updatedMessages = [...messages];
        updatedMessages[index] = newText;
        setMessages(updatedMessages);
        setParsedText(updatedMessages.join('\n\n\n'));
    };

    const handleShare = (message) => {
        const textEncoded = encodeURIComponent(`${message.trim()}\n${id}`);
        const shareUrl = `https://wa.me/?text=${textEncoded}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <div className="App">
            <h1 className='title'>Image to Text Converter</h1>
            <div className='inputDiv'>
                <input type="file" onChange={handleImageChange} />
                <button onClick={handleConvert} disabled={loading} className='convertBtn'>
                    {loading ? 'Converting...' : 'Convert to Text'}
                </button>
            </div>

            <div className='textDiv'>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows="10" cols="50" placeholder='Converted Text' />
                <textarea value={formattedText} onChange={(e) => setFormattedText(e.target.value)} rows="10" cols="50" placeholder="Formatted Text" />
                <textarea value={parsedText} onChange={(e) => setParsedText(e.target.value)} rows="10" cols="50" placeholder="Parsed Text" />
            </div>

            <div className="messageContainer">
                {messages.map((message, index) => (
                    <div key={index} className="messageBox">
                        <textarea
                            value={message}
                            onChange={(e) => handleTextChange(index, e.target.value)}
                            rows="5"
                            cols="50"
                            placeholder={`Message ${index + 1}`}
                        />
                        <div className='share'>
                            <button onClick={() => handleShare(message)} className='shareBtn'>Share Message {index + 1} on WhatsApp</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Converter;