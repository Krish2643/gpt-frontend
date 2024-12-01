import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import "./Main.css";

const Main = () => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert("image uploaded successfully");
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSubmit = async (e) => {
  //   if (!image) {
  //     alert("Please upload an image.");
  //     return;
  //   }

  //   if (input.length < 1) {
  //     alert("Please enter prompt...");
  //     return;
  //   }

  //   setIsLoading(true);
  //   console.log(input);
  //   setRecentPrompt(input);
  //   setInput("");

  //   const formData = new FormData();
  //   formData.append("image", image);
  //   formData.append("prompt", recentPrompt);

  //   try {
  //     const response = await axios.post(
  //       "https://gpt-backend-f39t.onrender.com/api/process-image",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setResult(response.data.extractedText);
  //   } catch (error) {
  //     console.error(error);
  //     alert("An error occurred while processing the image.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const extractTextFromImage = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }

    if (input.length < 1) {
      alert("Please enter prompt...");
      return;
    }

    setIsLoading(true);
    console.log(input);
    setRecentPrompt(input);
    setInput("");

    try {
      const subscriptionKey = import.meta.env.VITE_subscription_Key;

      const endpoint = import.meta.env.VITE_endpoint;

      // Step 1: Submit the image to the Read API
      const readResponse = await axios.post(
        `${endpoint}/vision/v3.2/read/analyze`,
        uploadedImage,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "Content-Type": "application/octet-stream", // Important for binary files
          },
        }
      );

      // Get the operation location from the headers
      const operationLocation = readResponse.headers["operation-location"];
      if (!operationLocation) {
        throw new Error("Failed to get operation location.");
      }

      // Step 2: Poll the Read API until the processing is complete
      let result = null;
      while (true) {
        const statusResponse = await axios.get(operationLocation, {
          headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
        });

        const { status, analyzeResult } = statusResponse.data;

        if (status === "succeeded") {
          result = analyzeResult;
          break;
        } else if (status === "failed") {
          throw new Error("Text recognition failed.");
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Step 3: Extract text from the result
      let extracted = "";
      result.readResults.forEach((page) => {
        page.lines.forEach((line) => {
          extracted += line.text + "\n";
        });
      });

      setExtractedText(extracted || "No handwritten text found.");
    } catch (error) {
      console.error(
        "Error extracting text:",
        error.response?.data || error.message
      );
      alert("Failed to extract text. Please check your configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Image Text Processor</p>
        <img src={assets.user} alt="" />
      </div>
      <div className="main-container">
        <>
          {!uploadedImage && (
            <div className="greet">
              <p className="color-text">Demo for Mr. Debashis Chakraborty</p>

              <p className="editor-name">
                Please upload your document to proceed
              </p>
            </div>
          )}
        </>

        <div className="result">
          <div className="result-title">
            <div className="result-des">
              <div className="result-extra">
                <img src={assets.user} alt="" />
                <p className="result-prompt">Promt: {recentPrompt}</p>
              </div>
              {uploadedImage && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={image}
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
                <pre
                  style={{ whiteSpace: "pre-wrap" }}
                  className="result-answer"
                >
                  {extractedText}
                </pre>
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
              <input
                type="file"
                id="image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <img
                src={assets.send_icon}
                alt=""
                onClick={() => {
                  extractTextFromImage();
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
