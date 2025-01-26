import React, { useState } from "react";
import Hero from "../../components/client/Hero";
import Title from "../../components/client/Title";
import Ctas from "../../components/client/Ctas";
import Section from "../../components/client/Section";
import Office from "../../components/client/Office";
import Testimonials from "../../components/client/Testimonials";
import VideoPlayer from "../../components/client/VideoPlayer";
import Contact from "../../components/client/Contact";

const Home = () => {
  const [playState, setPlayState] = useState(false);

  return (
    <>
      <Hero />
      <div className="max-w-6xl px-6 mx-auto">
        <>
          <Title
            subTitle="Tại sao lại chọn chúng tôi?"
            title="4 mô-đun, hơn 50 tính năng nâng cao cho các giải pháp liền mạch"
          />
          <Ctas />
        </>

        <Section setPlayState={setPlayState} />
        <>
          <Title
            subTitle="Văn phòng của chúng tôi"
            title="VĂN PHÒNG THIẾT KẾ VÀ THI CÔNG"
          />
          <Office />
        </>

        <>
          <Title
            subTitle="Lời chứng thực"
            title="Đối tác và khách hàng nói gì?"
          />

          <Testimonials />
        </>
        <>
          <Title subTitle="Liên hệ với chúng tôi" title="Liên hệ" />
          <Contact />
        </>
      </div>
      <VideoPlayer playState={playState} setPlayState={setPlayState} />
    </>
  );
};

export default Home;
