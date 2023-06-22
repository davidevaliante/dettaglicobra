import React, { FunctionComponent, useContext, useEffect } from "react";
import AquaClient from "../../../graphql/aquaClient";
import VideoDiscalimer from "../../../components/VideoDisclaimer/VideoDisclaimer";
import BonusStripe from "../../../components/BonusStripe/BonusStripe";
import { Streamer, StreamerBonus } from "../../../models/streamer";
import { configuration } from "../../../configuration";
import axios from "axios";
import lowerCase from "lodash/lowerCase";
import { useState } from "react";
import FullPageLoader from "../../../components/FullPageLoader";
import Wrapper from "../../../components/Layouts/Wrapper";
import Container from "../../../components/Layouts/Container";

interface Props {
  streamerData: Streamer;
  bonusToShow: number[];
}

const countryToHeader = (country: string) => {
  switch (country) {
    case "it":
      return "COMPARAZIONE OFFERTE SITI LEGALI IN ITALIA";

    case "row":
      return "BEST LICENSED CASINOS IN YOUR COUNTRY";

    case "mt":
      return "BEST LICENSED CASINOS IN MALTA";

    case "nz":
      return "BEST LICENSED CASINOS IN NEW ZELAND";

    case "ca":
      return "BEST LICENSED CASINOS IN CANADA";

    case "fi":
      return "SUOMEN PARHAAT ONLINE-KASINOT";

    case "nz":
      return "BEST LICENSED CASINOS IN NEW ZEALAND";

    case "au":
      return "BEST LICENSED CASINOS IN AUSTRALIA";

    case "no":
      return "BESTE NETTKASINOER I NORGE";

    case "ie":
      return "BEST LICENSED CASINOS IN IRELAND";

    case "in":
      return "BEST LICENSED CASINOS IN INDIA";

    case "jp":
      return "日本人向けのおすすめオンラインカジノ";

    case "es":
      return "MEJORES CASINOS ONLINE EN ESPAÑA";

    case "de":
      return "BESTE ONLINE CASINOS IN DEUTSCHLAND";

    case "gb":
      return "BEST ONLINE CASINOS IN THE UNITED KINGDOM";

    default:
      return "BEST LICENSED CASINOS IN YOUR COUNTRY";
  }
};

const Compare: FunctionComponent<Props> = ({ streamerData, bonusToShow }) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (country !== undefined) {
      if (country === "it") {
        getBonusByName();
      } else {
        getBonusList();
      }
    }
  }, [country]);

  const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(
    undefined
  );

  useEffect(() => {
    geoLocate();
  }, []);

  const geoLocate = async () => {
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
    console.log(streamerData);
    let base = streamerData.countryBonusList.filter(
      (it) => it.label === country
    );

    if (base.length == 0) {
      setCountry("row");
      return;
    }

    let bonusForCountry = base[0].bonuses;

    console.log(streamerData.countryBonusList, country);

    // if (bonusForCountry.length == 0) {
    // 	bonusForCountry = streamerData.countryBonusList.filter(
    // 		it => it.label === 'row'
    // 	)[0].bonuses
    // 	setCountry('row')
    // }

    const ordering = streamerData.countryBonusList
      .filter((it) => it.label === country)[0]
      //@ts-ignore
      .ordering.split(" ");

    // const requests = bonusForCountry[0].bonuses.map((b) =>
    //   axios.get(`${configuration.api}/bonuses/${b.id}`)
    // );

    // const bList = await Promise.all(requests);
    // let unorderedBonuses = bList.map((r) => r.data as StreamerBonus);

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
    console.log(streamerData.bonuses);
    const finalList = [...ordered]
      .map((b) => {
        const match = streamerData.bonuses.find((it) => it.id == b.id);
        if (match !== undefined) return match;
        else return undefined;
      })
      .filter((it) => it !== undefined);

    console.log(finalList, "final list");

    //@ts-ignore
    setBonuses(finalList);
  };

  const getBonusByName = () => {
    const streamerBonuses = streamerData.bonuses;
    const placeholder: StreamerBonus[] = [];

    console.log(bonusToShow);

    const remappedBonusToShow = [...bonusToShow];

    if (remappedBonusToShow.includes(47)) {
      const indexToRemove = remappedBonusToShow.indexOf(47);

      if (!remappedBonusToShow.includes(55)) {
        remappedBonusToShow.splice(indexToRemove, 1, 55);
      } else {
        remappedBonusToShow.splice(indexToRemove, 1, 33);
      }
    }

    remappedBonusToShow.forEach((bonusCode) => {
      const b = streamerBonuses.find((b) => b.id === bonusCode);
      if (b) placeholder.push(b);
    });

    setBonuses(placeholder);
  };

  const openWebsite = () => window.open("https://www.spikeslot.com");

  if (!bonuses && !country) return <FullPageLoader />;
  return (
    <Wrapper>
      <Container>
        <div
          className="top-bar"
          style={{ cursor: "pointer" }}
          onClick={() => openWebsite()}
        >
          <img className="logo" src="/icons/app_icon.png" />
        </div>

        {country === "it" ? (
          <h1>Comparazione offerte siti legali in Italia:</h1>
        ) : (
            <h1>Best casino offers for your country</h1>
          )}

        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            backgroundColor: "#333",
            width: "100%",
            padding: "10px 0px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: ".8rem",
              textAlign: "center",
            }}
          >
            {countryToHeader(country ? country : "row")}
          </div>
        </div>

        {bonuses &&
          bonuses.map((bonus: StreamerBonus) => (
            <BonusStripe
              key={`${bonus.name}`}
              bonus={bonus}
              countryCode={country ? country : "row"}
            />
          ))}

        <div style={{ padding: "1rem" }}>
          {country === "it" ? <VideoDiscalimer /> : <div></div>}
        </div>
      </Container>
    </Wrapper>
  );
};

export async function getServerSideProps({ query }) {
  const pickedbonus = query.bonuses;

  const bonustoshow = pickedbonus.split("-").map((b) => parseInt(b));

  const streamer = await axios.get(
    `${configuration.api}/streamers/${configuration.streamerId}`
  );

  return {
    props: {
      streamerData: streamer.data as Streamer,
      bonusToShow: bonustoshow,
    },
  };
}

export default Compare;
