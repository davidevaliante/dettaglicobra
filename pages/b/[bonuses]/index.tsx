import React, { FunctionComponent, useContext, useEffect } from "react";
import AquaClient from "../../../graphql/aquaClient";
import {
  BONUSES_BY_NAME,
  STREAMER_BY_ID,
} from "../../../graphql/queries/bonus";
import { Bonus } from "../../../graphql/schema";
import styled from "styled-components";
import { tablet } from "../../../components/Responsive/Breakpoints";
import { initializeAnalytics } from "../../../analytics/base";
import { cookieContext } from "../../../context/CookieContext";
import CookieDisclaimer from "../../../components/CookieDisclaimer/CookieDisclaimer";
import VideoDiscalimer from "../../../components/VideoDisclaimer/VideoDisclaimer";
import BonusStripe from "../../../components/BonusStripe/BonusStripe";
import { Streamer, StreamerBonus } from "../../../models/streamer";
import {
  configuration,
  off,
  onOffConfig,
  redirectPage,
} from "../../../configuration";
import axios from "axios";
import Router from "next/router";
import lowerCase from "lodash/lowerCase";
import { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import FullPageLoader from "../../../components/FullPageLoader";
import Wrapper from "../../../components/Layouts/Wrapper";
import Container from "../../../components/Layouts/Container";

interface Props {
  streamerData: Streamer;
  bonusToShow: number[];
}

const Compare: FunctionComponent<Props> = ({ streamerData, bonusToShow }) => {
  const [country, setCountry] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (country !== "") getBonusByName();
  }, [country]);
  const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(
    undefined,
  );

  useEffect(() => {
    geoLocate();
  }, []);

  const geoLocate = async () => {
    setCountry(undefined);

    const offData = await axios.get(
      "https://spike-2481d.firebaseio.com/Spare/Cobra.json",
    );
    const { active } = offData.data;

    if (!active) {
      window.location.replace(`https://dettagli.milicompare.info/about`);
    } else {
      const userCountryRequest = await axios.get(configuration.geoApi);
      const countryCode = lowerCase(userCountryRequest.data.country_code2);
      setCountry(countryCode);
    }
  };

  const getBonusByName = () => {
    const streamerBonuses = streamerData.bonuses;
    const placeholder: StreamerBonus[] = [];

    console.log(bonusToShow);

    bonusToShow.forEach((bonusCode) => {
      const b = streamerBonuses.find((b) => b.id === bonusCode);
      if (b) placeholder.push(b);
    });

    setBonuses(placeholder);
    console.log(placeholder, "bonus to show");
  };

  if (!country) return <FullPageLoader />;
  if (country !== "it" && country !== "mt") {
    // if (country === 'it')
    return (
      <Wrapper>
        <Container>
          <div className="top-bar" style={{ cursor: "pointer" }}>
            <img className="logo" src="/icons/app_icon.png" />
          </div>

          <div>
            <h1 style={{ margin: "1rem 0rem" }}>
              Watch more YouTube videos :
            </h1>
            <div className="rwd-video">
              <iframe
                src={`https://www.youtube.com/embed/290b2Pmj0ZI`}
                allowFullScreen
                frameBorder="0"
                height="315"
                width="560"
              />
            </div>

            <div className="rwd-video">
              <iframe
                src={`https://www.youtube.com/embed/NXZsfSlZvL0`}
                allowFullScreen
                frameBorder="0"
                height="315"
                width="560"
              />
            </div>

            <div className="rwd-video">
              <iframe
                src={`https://www.youtube.com/embed/X4wJDs8A5lQ`}
                allowFullScreen
                frameBorder="0"
                height="315"
                width="560"
              />
            </div>
          </div>
        </Container>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Container>
        <div className="top-bar" style={{ cursor: "pointer" }}>
          <img className="logo" src="/icons/app_icon.png" />
        </div>

        <h1>Comparazione offerte siti legali in Italia:</h1>

        {bonuses &&
          bonuses.length > 2 &&
          bonuses.map((bonus: StreamerBonus) => (
            <BonusStripe
              key={`${bonus.name}`}
              bonus={bonus}
              countryCode={country}
            />
          ))}

        {bonuses &&
          bonuses.length <= 2 &&
          streamerData.bonuses.map((bonus: StreamerBonus) => (
            <BonusStripe
              key={`${bonus.name}`}
              bonus={bonus}
              countryCode={country}
            />
          ))}

        <div style={{ padding: "1rem" }}>
          <VideoDiscalimer />
        </div>
        {process.env.REFER === "true" && (
          <div className="bottom">
            <p style={{ textAlign: "center" }}>
              This service is provided by{" "}
              <a href="https://www.topaffiliation.com">
                Top Affiliation
              </a>
            </p>
          </div>
        )}
      </Container>
    </Wrapper>
  );
};

export async function getServerSideProps({ query }) {
  const pickedBonus = query.bonuses;

  const aquaClient = new AquaClient();

  const bonusToShow = pickedBonus.split("-").map((b) => parseInt(b));

  const streamer = await axios.get(
    `${configuration.api}/streamers/${configuration.streamerId}`,
  );

  return {
    props: {
      streamerData: streamer.data as Streamer,
      bonusToShow: bonusToShow,
    },
  };
}

export default Compare;
