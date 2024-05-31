import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import {
  getGrayScale,
  getBluredFaces,
  getBGremoved,
  getBlackeWhite,
  getDeletedChannels,
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
  const [isAdvancedModificationsVisible, setIsAdvancedModificationsVisible] =
    useState(false);
  const [advancedModifications, setAdvancedModifications] = useState({
    red: 0.5,
    green: 0.5,
    blue: 0.5,
  });
  const [savedModifications, setSavedModifications] = useState({
    red: 0.5,
    green: 0.5,
    blue: 0.5,
  });

  useEffect(() => {
    console.log(advancedModifications);
  }, [advancedModifications]);

  const filters = [
    "gray scale",
    "blur faces",
    "remove background",
    "black & white",
    "green only",
    "red only",
    "blue only",
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
      } else if (filter === "green only") {
        const url = await getDeletedChannels(file, setRequestPending, [0, 2]);
        console.log(url);
        setResultUrl(url);
      } else if (filter === "red only") {
        const url = await getDeletedChannels(file, setRequestPending, [0, 1]);
        console.log(url);
        setResultUrl(url);
      } else if (filter === "blue only") {
        const url = await getDeletedChannels(file, setRequestPending, [1, 2]);
        console.log(url);
        setResultUrl(url);
      }
    }
  };

  useEffect(() => {
    async function fetchImage(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      return blob;
    }
    if (resultUrl) {
      fetchImage(resultUrl)
        .then((blob) => {
          setResultImage(blob);
          console.log("Image fetched:", blob);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [resultUrl]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "downloaded-image.jpg";
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
              <div
                className="flex py-1 hover:text-[#395B64] hover:bg-[#E7F6F2] ease-in-out duration-200 px-2 cursor-pointer"
                onClick={() => {
                  setIsAdvancedModificationsVisible(true);
                  setIsDropDownVisible(false);
                }}
              >
                <p className={`font-semibold `}>advanced modifications</p>
              </div>
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
            <div
              className="flex items-center justify-center relative cursor-pointer"
              onMouseEnter={() => setResultImageHovered(true)}
              onMouseLeave={() => setResultImageHovered(false)}
            >
              <img
                src={resultUrl}
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
      {isAdvancedModificationsVisible && (
        <motion.div
          className="w-[70vw] h-[70vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 z-50 rounded-lg
          flex flex-col items-center 
          "
        >
          <div className="absolute text-[#395B64] text-3xl right-5 top-3">
            <IoIosClose
              className="cursor-pointer"
              onClick={() => setIsAdvancedModificationsVisible(false)}
            />
          </div>
          <h2 className="text-[#395B64] font-semibold text-xl">
            Advanced Modifications
          </h2>

          <div className="w-full h-full m-8 grid grid-cols-2 gap-5">
            <div className="col-span-1 flex flex-col items-center p-2 gap-5">
              <div className="grid grid-cols-5 items-center justify-center w-full">
                <label
                  htmlFor="red"
                  className="text-[#395B64] font-semibold col-span-1 flex items-center"
                >
                  Red:
                </label>
                <div className="flex items-center w-full col-span-4">
                  <input
                    type="range"
                    id="red"
                    name="red"
                    min="0"
                    max="1"
                    step="0.01"
                    value={advancedModifications.red}
                    onChange={(e) =>
                      setAdvancedModifications({
                        ...advancedModifications,
                        red: parseFloat(e.target.value),
                      })
                    }
                    className="col-span-4 w-full"
                  ></input>
                </div>
              </div>

              <div className="grid grid-cols-5 items-center justify-center w-full">
                <label
                  htmlFor="green"
                  className="text-[#395B64] font-semibold col-span-1 flex items-center"
                >
                  Green:
                </label>
                <div className="flex items-center w-full col-span-4">
                  <input
                    type="range"
                    id="green"
                    name="green"
                    min="0"
                    max="1"
                    step="0.01"
                    value={advancedModifications.green}
                    onChange={(e) =>
                      setAdvancedModifications({
                        ...advancedModifications,
                        green: parseFloat(e.target.value),
                      })
                    }
                    className="col-span-4 w-full"
                  ></input>
                </div>
              </div>

              <div className="grid grid-cols-5 items-center justify-center w-full">
                <label
                  htmlFor="blue"
                  className="text-[#395B64] font-semibold col-span-1 flex items-center"
                >
                  Blue:
                </label>
                <div className="flex items-center w-full col-span-4">
                  <input
                    type="range"
                    id="blue"
                    name="blue"
                    min="0"
                    max="1"
                    step="0.01"
                    value={advancedModifications.blue}
                    onChange={(e) =>
                      setAdvancedModifications({
                        ...advancedModifications,
                        blue: parseFloat(e.target.value),
                      })
                    }
                    className="col-span-4 w-full"
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <button
            className="absolute right-10 bottom-10 text-sm bg-[#395B64] text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => {
              setSavedModifications(advancedModifications);
              setIsAdvancedModificationsVisible(false);
            }}
          >
            Save
          </button>
        </motion.div>
      )}
      {isAdvancedModificationsVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></motion.div>
      )}
    </section>
  );
}

export default ImageDropSpace;
