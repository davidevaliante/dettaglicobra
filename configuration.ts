export interface Config {
  streamerId: string | number;
  streamerName: string;
  api: string;
  primaryColor: string;
  secondaryColor: string;
  fontString: string;
  font: string;
  youtubeMetatag?: string;
  geoApi: string;
}

export const configuration: Config = {
  streamerId: 139,
  streamerName: "ilcobrayt",
  api: "https://compare.topadsservices.com",
  primaryColor: "#2b2b2b",
  secondaryColor: "#ff6347",
  fontString:
    "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
  font: "Turret Road",
  geoApi:
    "https://api.ipgeolocation.io/ipgeo?apiKey=d9c8ca199b3f40fabc69dfdfefdc9aa2",
};

export let onOffConfig = {
  off: false,
  redirectPage: "google.com",
};
