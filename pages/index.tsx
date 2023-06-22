import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { configuration } from "../configuration";
import AquaClient from "../graphql/aquaClient";
import { Streamer, StreamerBonus } from "../models/streamer";
import Wrapper from "../components/Layouts/Wrapper";
import BonusStripe from "../components/BonusStripe/BonusStripe";
import VideoDiscalimer from "../components/VideoDisclaimer/VideoDisclaimer";
import FullPageLoader from "../components/FullPageLoader";
import Container from "../components/Layouts/Container";
import lowerCase from "lodash/lowerCase";

interface Props {
  streamerData: Streamer;
}

const index: FunctionComponent<Props> = ({ streamerData }) => {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string>("");
  useEffect(() => {
    country !== "" && getBonusList();
  }, [country]);
  const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(
    undefined
  );
  useEffect(() => { }, [bonuses]);

  useEffect(() => {
    geoLocate();
  }, []);

  const geoLocate = async () => {
    setLoading(true);

    const offData = await axios.get(
      "https://spike-2481d.firebaseio.com/Spare/Cobra.json"
    );
    const { active } = offData.data;

    if (!active) {
      window.location.replace(`/about`);
    } else {
      const userCountryRequest = await axios.get(configuration.geoApi);
      const countryCode = lowerCase(userCountryRequest.data.country_code2);

      if (countryCode) setCountry(countryCode);
    }
  };

  const getBonusList = async () => {
    console.log(country);
    console.log(streamerData);
    let bonusForCountry = streamerData.countryBonusList.filter(
      (it) => it.label === country
    )[0].bonuses;

    if (bonusForCountry.length == 0) {
      bonusForCountry = streamerData.countryBonusList.filter(
        (it) => it.label === "row"
      )[0].bonuses;
      setCountry("row");
    }

    const ordering = streamerData.countryBonusList
      .filter((it) => it.label === country)[0]
      //@ts-ignore
      .ordering.split(" ");

    let unorderedBonuses = [...bonusForCountry];

    let ordered: StreamerBonus[] = [];

    ordering.forEach((code) => {
      const matchingBonus = unorderedBonuses.find(
        (it) => it.compareCode === code
      );
      if (matchingBonus) {
        ordered.push(matchingBonus);
        unorderedBonuses = unorderedBonuses.filter(
          (b) => b.compareCode !== code
        );
      }
    });

    const finalList = [...ordered, ...unorderedBonuses]
      .map((b) => {
        const match = streamerData.bonuses.find((it) => it.id == b.id);
        if (match !== undefined) return match;
        else return undefined;
      })
      .filter((it) => it !== undefined);

    //@ts-ignore
    setBonuses(finalList);
    setLoading(false);
  };

  if (loading) return <FullPageLoader />;
  return (
    <Wrapper>
      <Container>
        <div className="top-bar">
          <img className="logo" src="/icons/app_icon.png" />
        </div>

        {country === "it" ? (
          <h1>Comparazione offerte siti legali in Italia:</h1>
        ) : (
            <h1>Best Casino Offers for your country</h1>
          )}

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
          {country === "it" && <VideoDiscalimer />}
        </div>
        {process.env.REFER === "true" && (
          <div className="bottom">
            <p style={{ textAlign: "center" }}>
              This service is provided by{" "}
              <a href="https://www.topaffiliation.com">Top Affiliation</a>
            </p>
          </div>
        )}
      </Container>
    </Wrapper>
  );
};

export async function getServerSideProps({ query }) {
  const pickedBonus = query.options;

  const aquaClient = new AquaClient();

  const streamer = await axios.get(
    `${configuration.api}/streamers/${configuration.streamerId}`
  );

  return {
    props: {
      streamerData: streamer.data as Streamer,
    },
  };
}

export default index;
