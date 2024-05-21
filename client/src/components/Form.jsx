import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import {
  getGrayScale,
  getBluredFaces,
  getBGremoved,
  getBlackeWhite,
} from "../http";

function ImageDropSpace() {
  const [highlighted, setHighlighted] = useState(false);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState("gray scale");
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [fileMissingError, setFileMissingError] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [resultImageHovered, setResultImageHovered] = useState(false);

  const filters = [
    "gray scale",
    "blur faces",
    "remove background",
    "black & white",
  ];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlighted(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlighted(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlighted(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileMissingError(false);
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      document.getElementById("drop-area").innerHTML = "";
      document.getElementById("drop-area").appendChild(img);
    };
    reader.readAsDataURL(file);
  };

  const generateImage = async () => {
    if (!file) {
      setFileMissingError(true);
      console.log("no file selected");
      return;
    } else {
      if (filter === "gray scale") {
        const url = await getGrayScale(file, setRequestPending);
        console.log(url);
        setResultUrl(url);
      } else if (filter === "blur faces") {
        const url = await getBluredFaces(file, setRequestPending);
        console.log(url);
        setResultUrl(url);
      } else if (filter === "remove background") {
        const url = await getBGremoved(file, setRequestPending);
        console.log(url);
        setResultUrl(url);
      } else if (filter === "black & white") {
        const url = await getBlackeWhite(file, setRequestPending);
        console.log(url);
        setResultUrl(url);
      }
    }
  };

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = 'downloaded-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <section className="grid lg:grid-cols-12">
      <div className="flex flex-col items-center lg:col-span-5">
        <div
          id="drop-area"
          className={`
          w-96 h-96 border-2 border-dashed border-gray-400 flex items-center justify-center ${
            highlighted ? "bg-gray-200" : ""
          }
            rounded-lg
            `}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-[#395B64] font-semibold flex gap-3 items-center">
            Drag and drop an image here{" "}
            <span className="text-2xl">
              <IoCloudUploadOutline />
            </span>
          </p>
        </div>
        <div className="mt-10">
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileSelection}
            accept="image/*"
          />
          <label
            htmlFor="file-input"
            className="bg-[#395B64] text-white font-bold py-2 px-4 rounded cursor-pointer mr-2"
          >
            Browse
          </label>
        </div>
      </div>
      <div className="flex flex-col items-center lg:col-span-2 relative">
        <div className="w-[200px] border-2">
          <div
            className="relative flex justify-between w-full px-4 py-1 
            rounded-lg items-center cursor-pointer ease-in-out duration-300
            "
            onClick={() => setIsDropDownVisible(!isDropDownVisible)}
          >
            <p className="font-semibold text-[#395B64]">{filter}</p>
            <span className="text-[#395B64] text-sm">
              {isDropDownVisible ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {isDropDownVisible && (
            <motion.div
              className="px-4 py-2 w-full"
              initial={{ opacity: 0, y: "-10vh" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {filters.map((item, index) => (
                <div
                  key={index}
                  className="flex py-1 hover:text-[#395B64] hover:bg-[#E7F6F2] ease-in-out duration-200 px-2 cursor-pointer"
                  onClick={() => {
                    setFilter(item);
                    setIsDropDownVisible(false);
                  }}
                >
                  <p
                    className={`font-semibold ${
                      item === filter && "text-[#395B64]"
                    }`}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="absolute bottom-[50%]">
          {fileMissingError && (
            <p className="text-red-500 font-semibold">Please select an image</p>
          )}
        </div>
      </div>

      <div className="col-span-5 flex flex-col items-center ">
        <div
          className={`
          w-96 h-96 border-2 border-dashed border-gray-400 flex items-center justify-center
          rounded-lg
          `}
        >
          {resultUrl && !requestPending ? (
            <div className="flex items-center justify-center relative cursor-pointer"
              onMouseEnter={() => setResultImageHovered(true)}
              onMouseLeave={() => setResultImageHovered(false)}
            >
              <img src={resultUrl}
              className="object-cover transition duration-300 ease-in-out transform hover:blur-sm hover:brightness-50"
              onClick={handleDownload}
              />
              {resultImageHovered && (
                <motion.div
                className="text-white absolute text-3xl"
                initial={{ opacity: 0, y: "-30px" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                onClick={handleDownload}
                >
                  <FaDownload />
                </motion.div>
              )}
            </div>
          ) : requestPending ? (
            <p className="text-[#395B64] font-semibold">
              <div className="loader"></div>
            </p>
          ) : (
            <p className="text-[#395B64] font-semibold">
              Generated image will be here ...
            </p>
          )}
        </div>
        <div className="mt-10">
          <button
            className="bg-[#395B64] text-white font-bold py-2 px-4 rounded cursor-pointer mr-2"
            onClick={async () => await generateImage()}
            disabled={requestPending}
          >
            {requestPending ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ImageDropSpace;
