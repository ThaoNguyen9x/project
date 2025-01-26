import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";

import { links } from "./Mylinks";

const NavbarLinks = ({ setOpen }) => {
  const location = useLocation();

  const openRef = useRef(null);
  const [dropdown, setDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setDropdown((prev) => (prev === index ? null : index));
  };

  const handleClickOutside = (event) => {
    if (openRef.current && !openRef.current.contains(event.target)) {
      setDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const isParentActive = (sublinks) =>
    sublinks.some((sublink) => isActive(sublink.path));

  return (
    <nav className="flex flex-col sm:flex-row gap-5 text-nowrap" ref={openRef}>
      {links.map((link, index) => (
        <div key={index} className="relative">
          {link.sublinks ? (
            <>
              {/* Dropdown toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(index);
                }}
                className={`flex items-center gap-2 text-base font-medium hover:text-red-700 uppercase
                  ${
                    isParentActive(link.sublinks) || dropdown === index
                      ? "text-red-700"
                      : ""
                  }`}
              >
                {link.name}
                <FaCaretDown
                  className={`transition-transform duration-300 text-sm ${
                    dropdown === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdown === index && (
                <div className="absolute top-full mt-2 bg-white shadow-md rounded sm:block hidden">
                  {link.sublinks.map((sublink, subIndex) => (
                    <Link
                      key={subIndex}
                      to={sublink.path}
                      className={`block px-4 py-2 text-base font-medium ${
                        isActive(sublink.path)
                          ? "text-red-700"
                          : "text-gray-500 hover: hover:text-red-700"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Dropdown for mobile */}
              {dropdown === index && (
                <div className="block md:hidden">
                  {link.sublinks.map((sublink, subIndex) => (
                    <Link
                      key={subIndex}
                      to={sublink.path}
                      className={`block px-4 py-2 text-base font-medium ${
                        isActive(sublink.path)
                          ? "text-[#b91c1c]"
                          : "text-gray-500 hover:text-[#b91c1c]"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              to={link.path}
              className={`flex items-center gap-2 text-base font-medium hover:text-red-700 uppercase ${
                isActive(link.path) ? "text-red-700" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavbarLinks;
