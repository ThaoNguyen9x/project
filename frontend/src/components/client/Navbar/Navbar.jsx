import React, { useEffect, useRef, useState } from "react";

import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

import NavbarLinks from "./NavbarLinks";

const Navbar = () => {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed w-full top-0 z-50 py-4 bg-white text-blue-950 shadow-md">
      <div className="container max-w-6xl px-6 mx-auto relative lg:text-sm">
        <div className="flex items-center justify-between">
          <div className="z-50 flex items-center w-full justify-between">
            <Link
              to="/"
              className="text-2xl text-blue-950 font-bold transition-all duration-300"
            >
              B-MS
            </Link>
            <div
              className="sm:hidden"
              onClick={(e) => {
                e.stopPropagation(), setOpen(!open);
              }}
            >
              {open ? (
                <IoClose className="text-2xl text-blue-950" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </div>
          </div>
          <ul className="sm:flex hidden space-x-6">
            <NavbarLinks setOpen={setOpen} />
          </ul>

          {/* Mobile nav */}
          <ul
            className={`bg-white text-blue-950 sm:hidden fixed w-full md:w-[40%] h-full bottom-0 py-16 pl-6 transition-all duration-500 ${
              open ? "right-0 shadow-md" : "-right-[100%]"
            }`}
            ref={menuRef}
          >
            <NavbarLinks setOpen={setOpen} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
