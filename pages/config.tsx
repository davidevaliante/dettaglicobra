import { onOffConfig, redirectPage } from "../configuration";
import { FunctionComponent, useState } from "react";
import axios from "axios";

const Config: FunctionComponent = (props: any) => {
  const [onOff, setOnOff] = useState(props.active);

  const handleSwitch = async () => {
    await axios.put(`https://spike-2481d.firebaseio.com/Spare/Cobra.json`, {
      active: !onOff,
    });
    setOnOff(!onOff);
  };

  return (
    <div>
      <div
        style={{
          margin: "2rem",
        }}
      >
        <h1>Status</h1>
        <div>
          <div
            style={{
              margin: "1rem 0rem",
            }}
          >
            <p style={{ display: "inline", marginRight: "1rem" }}>
              {onOff ? "Attivo" : "Non Attivo"}
            </p>
            <button onClick={handleSwitch}>Switch</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const offData = await axios.get(
    "https://spike-2481d.firebaseio.com/Spare/Cobra.json",
  );
  const { active } = offData.data;

  return {
    props: {
      active,
    },
  };
};

export default Config;
