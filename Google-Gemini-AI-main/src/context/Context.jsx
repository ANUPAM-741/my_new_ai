// import React from "react";
// import run from "../config/gemini.js";
// import { marked } from "marked";

// export const Context = React.createContext();

// const ContextProvider = (props) => {
//   const [input, setInput] = React.useState("");
//   const [recentPrompt, setRecentPrompt] = React.useState("");
//   const [prevPrompts, setPrevPrompts] = React.useState([]);
//   const [showResult, setShowResult] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);
//   const [resultData, setResultData] = React.useState("");

//   const delayPara = (index, nextWord) => {
//     setTimeout(() => {
//       setResultData((prev) => prev + nextWord);
//     }, 75 * index);
//   };

//   function Markdown(markdownData) {
//     return marked.parse(markdownData);
//   }

//   const newChat = () => {
//     setLoading(false);
//     setShowResult(false);
//   };
//   const onSent = async (prompt) => {
//     setInput("");
//     setResultData("");
//     setLoading(true);
//     setShowResult(true);
//     let response;
//     if (prompt !== undefined) {
//       response = await run(prompt);
//       setRecentPrompt(prompt);
//     } else {
//       setPrevPrompts((prev) => [...prev, input]);
//       setRecentPrompt(input);
//       response = await run(input);
//     }
//     let newResponseArray = Markdown(response).split(" ");
//     for (let i = 0; i < newResponseArray.length; i++) {
//       const nextWord = newResponseArray[i];
//       delayPara(i, nextWord + " ");
//     }
//     setLoading(false);
//   };

//   const contextValue = {
//     prevPrompts,
//     setPrevPrompts,
//     onSent,
//     setRecentPrompt,
//     recentPrompt,
//     showResult,
//     loading,
//     resultData,
//     input,
//     setInput,
//     newChat,
//   };
//   return (
//     <Context.Provider value={contextValue}>{props.children}</Context.Provider>
//   );
// };

// export default ContextProvider;

import React from "react";
import run from "../config/gemini.js";
import { marked } from "marked";

export const Context = React.createContext();

const ContextProvider = (props) => {
  const [input, setInput] = React.useState("");
  const [recentPrompt, setRecentPrompt] = React.useState("");
  const [prevPrompts, setPrevPrompts] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resultData, setResultData] = React.useState("");
  const [error, setError] = React.useState(null);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  function Markdown(markdownData) {
    return marked.parse(markdownData);
  }

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setError(null);
  };

  const onSent = async (prompt) => {
    setInput("");
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setError(null);

    try {
      console.log("Sending prompt to Gemini:", prompt || input);
      let response;
      if (prompt !== undefined) {
        response = await run(prompt);
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await run(input);
      }

      console.log("Received response from Gemini:", response);
      let newResponseArray = Markdown(response).split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      setError("An error occurred while processing your request. Please try again.");
      setResultData(""); // Clear any partial results
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    error,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
