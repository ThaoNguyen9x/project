import React from "react";
import Contact from "../../components/client/Contact";
import Breadcrumbs from "../../components/client/Breadcrumbs";

const ContactUs = () => {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-6xl px-6 mx-auto">
        <Contact />
      </div>
    </>
  );
};

export default ContactUs;
