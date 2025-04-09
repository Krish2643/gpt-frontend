import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import "./Main.css";

const Main = () => {
  // let showResults = true;

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     alert("image uploaded successfully");
  //     setImage(file);
  //     // console.log("Selected file:", file);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setUploadedImage(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    if (input.length < 1) {
      alert("Please enter prompt...");
      return;
    }

    setIsLoading(true);
    // console.log(input);
    // setRecentPrompt(input);
    // setInput("");


    try {
      const response = await axios.post(
        "http://20.193.128.47:8020/api/draft-contract",
        {
          "query": input
        },
      );
      setResult(response.data.contract);
      console.log(response.data.contract);
      setInput("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  function formatData(input) {
    // Split the input based on the numbered sections
    const regex = /\d+\.\s\*\*(.*?)\*\*:\s([^\d]+)/g;
    let matches;
    const formattedData = [];

    // Match the parts (e.g., Definition, Name) and their respective descriptions
    while ((matches = regex.exec(input)) !== null) {
      formattedData.push(`${matches[1]}: ${matches[2].trim()}`);
    }

    return `${formattedData.join("\n")}`;
  }

  return (
    <div className="main">
      <div className="nav">
        <div className="" >
        <img className="logo" src={`https://media.istockphoto.com/id/2174552585/photo/judges-gavel-as-a-symbol-of-legal-system-and-wooden-stand-with-text-word.webp?a=1&b=1&s=612x612&w=0&k=20&c=y0lhzMkn0xF96Faoq2YhRDpM-6NtYj5nEOx0H56epzk=`} alt="" />
        </div>
        <img src={assets.user} alt="" />
      </div>
      <div className="main-container">
        <>
          { !uploadedImage && <div className="greet">
            <p className="color-text">Demo for Legal AI</p>

            {/* <p className="editor-name">
              Please upload your document to proceed
            </p> */}
          </div>}
        </>

        <div className="result">
          <div className="result-title">
            <div className="result-des">
             <div className="result-extra">
                <img src={assets.user} alt="" />
                {/* <p className="result-prompt">Promt: {recentPrompt}</p> */}
              </div>
            {uploadedImage && (
            <div>
              <p>Preview:</p>
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                style={{
                  width: "800px",
                  height: "400px",
                  borderRadius: 0,
                  
                }}
              />
            </div>
          )}

              {isLoading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <pre style={{ whiteSpace: "pre-wrap" }} className="result-answer" >{result}</pre>
              )}
            </div>
          </div>
        </div>
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
            />
            <div>
              <label htmlFor="image">
                <img
                  src={assets.gallery_icon}
                  alt="Upload"
                  style={{
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                    marginTop: "5px",
                  }}
                />
              </label>
              {/* <input
                type="file"
                id="image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              /> */}

              <img
                src={assets.send_icon}
                alt=""
                onClick={() => {
                  handleSubmit();
                }}
              />
            </div>
          </div>
          <div className="bottom-info">
            <p>
              This may display inaccurate info, including about people, so
              double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
