import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import UserHeader from '../Header/UserHeader';

// Function to get default code snippets for each language
const getDefaultCode = (language) => {
  const codeSnippets = {
    python: 'print("Hello, World!")',
    cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    javascript: 'console.log("Hello, World!");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    php: '<?php\n    echo "Hello, World!";\n?>'
  };

  return codeSnippets[language] || '';
};

// Function to run code with selected language and content
const runCode = (language, code, input) => {
  const fileNameMap = {
    python: 'index.py',
    cpp: 'main.cpp',
    javascript: 'main.js',
    java: 'Main.java',
    c: 'main.c',
    php: 'index.php'
  };

  const payload = JSON.stringify({
    language: language,
    stdin: input,
    files: [
      {
        name: fileNameMap[language] || 'main',
        content: code
      }
    ]
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Error connecting to the server'));
        }
      }
    };

    xhr.open('POST', 'https://onecompiler-apis.p.rapidapi.com/api/v1/run');
    xhr.setRequestHeader('x-rapidapi-key', '53335ef937msh1e452d2a916b013p168a60jsn1bae19569914');
    xhr.setRequestHeader('x-rapidapi-host', 'onecompiler-apis.p.rapidapi.com');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(payload);
  });
};

const CodeRunner = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(getDefaultCode('python'));
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [editorMode, setEditorMode] = useState('vs-dark');

  const handleThemeChange = () => {
    setEditorMode(editorMode === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage)); // Set default code for the selected language
  };

  const handleSubmit = async () => {
    try {
      const result = await runCode(language, code, input);
  
      const { status, stdout, stderr } = result;
  
      if (status === 'success') {
        setOutput(`Output:\n${stdout || 'No output'}\n\nErrors:\n${stderr || 'No errors'}`);
      } else {
        setOutput(`Code Execution Status: ${status}\n\nErrors:\n${stderr || 'An error occurred'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <UserHeader />
      <div className={`App ${editorMode}`}>
        <div className={`header ${editorMode}`}>
          <h3 className={`app-name ${editorMode}`}>
            <i className="fas fa-cube" aria-hidden="true"></i> Online Code Runner
          </h3>
          <div className="nav-right-options">
            <i
              id="theme-icon"
              className={`fas fa-${editorMode === 'vs-dark' ? 'moon' : 'sun'} fa-2x theme-icon ${editorMode}`}
              aria-hidden="true"
              onClick={handleThemeChange}
            ></i>
          </div>
        </div>

        <div className="secondary-nav-items">
          <button id="language-button" className={`language-button ${editorMode}`}>
            <select
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="php">PHP</option>
            </select>
          </button>
          <button className="btn run-btn" onClick={handleSubmit}>
            <i className="fas fa-play fa-fade run-icon" aria-hidden="true"></i> Run
          </button>
        </div>

        <div className="editor">
          <Editor
            height="200px"
            theme={editorMode}
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{ scrollBeyondLastLine: false, fontSize: '14px', folding: false }}
          />
        </div>
        
        <div className="std-input-output">
          <div className="std-input">
            <textarea
              rows="4"
              cols="50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your code here"
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>
          <div className="std-output">
            <Editor
              height="200px"
              theme={editorMode}
              defaultLanguage="plaintext"
              value={output}
              options={{ minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, fontSize: '14px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;
