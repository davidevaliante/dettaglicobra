import { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";

const Config: FunctionComponent = () => {
  const [status, setStatus] = useState<"active" | "inactive">();

  useEffect(() => {
    getCurrentStatus();
  }, []);

  const getCurrentStatus = async () => {
    const offData = await axios.get(
      "https://spike-2481d.firebaseio.com/Spare/Cobra.json",
    );
    const { active } = offData.data;

    active ? setStatus("active") : setStatus("inactive");
  };

  const handleSwitch = async () => {
    const payload = status === "active"
      ? {
        active: false,
      }
      : {
        active: true,
      };
    const offData = await axios.put(
      "https://spike-2481d.firebaseio.com/Spare/Cobra.json",
      payload,
    );

    console.log(offData.status);

    if (offData.status == 200) {
      console.log("yeps");
      setStatus(payload.active == true ? "inactive" : "active");
    }

    setStatus(status === "active" ? "inactive" : "active");
  };

  return (
    <div>
      <div style={{ margin: "1rem" }}>
        Status : {status}

        <button
          onClick={handleSwitch}
          style={{
            display: "block",
            marginTop: "1rem",
          }}
        >
          {`Switch to ${status === "active" ? "inactive" : "active"}`}
        </button>
      </div>
    </div>
  );
};

export default Config;
