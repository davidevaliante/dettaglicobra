import { FunctionComponent } from "react";
import Wrapper from "../components/Layouts/Wrapper";
import Container from "../components/Layouts/Container";

const About: FunctionComponent = () => {
  return (
    <Wrapper>
      <Container>
        <div className="top-bar">
          <img className="logo" src="/icons/app_icon.png" />
        </div>
        <div>
          <p style={{ margin: "3rem", marginTop: "4rem" }}>
            Nel 2015 Paolo e Mimmo hanno creato IL COBRA per condividere con una
            community crescente la loro passione principale: il calcio e lo
            sport in generale. Poi è arrivato Anso...
          </p>

          <div style={{ display: "flex" }}>
            <img style={{ margin: "auto auto" }} src="/cobra_team.jpg" />
          </div>
          <a
            style={{
              margin: "2rem",
              textAlign: "center",
              display: "block",
            }}
            href="https://www.instagram.com/ilcobratipster/"
          >
            Segui IL COBRA su instagram cliccando qui!
          </a>
        </div>
      </Container>
    </Wrapper>
  );
};

export default About;
