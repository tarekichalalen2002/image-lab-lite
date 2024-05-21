import React from "react";

// dark_gray:"#2C3333",
// dark_blue:"#395B64",
// light_gray:"#E7F6F2",
// light_blue:"#A5C9CA",

function Header() {
  return (
    <header className="w-full h-[10vh] flex px-[5vw] justify-center items-center">
        <h1 className={`text-2xl font-bold text-[#395B64]`}>Image Lab Lite</h1>
    </header>
  );
}

export default Header;
